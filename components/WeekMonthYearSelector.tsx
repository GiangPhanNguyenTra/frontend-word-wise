import { Picker } from "@react-native-picker/picker";
import { endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

type Props = {
  mode: "week" | "month" | "year";
  onChange: (range: { start: Date; end: Date }) => void;
};

export default function WeekMonthYearSelector({ mode, onChange }: Props) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const { width: screenWidth } = useWindowDimensions();

  const months = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  // Generate 12 tuần gần nhất
  const weeks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const date = subWeeks(now, i);
      const start = startOfWeek(date, { weekStartsOn: 1 }); // Thứ 2 đầu tuần
      const end = endOfWeek(date, { weekStartsOn: 1 });
      arr.push({
        label: `${format(start, "dd/MM")} - ${format(end, "dd/MM")}`,
        start,
        end,
      });
    }
    return arr; // [Tuần này, Tuần trước, ...]
  }, []);

  // Reset logic khi đổi mode -> Tự động trigger onChange về "Hiện tại"
  useEffect(() => {
    if (mode === "week") {
      onChange({ start: weeks[0].start, end: weeks[0].end });
      setSelectedWeekIndex(0);
    } else if (mode === "month") {
      const start = new Date(selectedYear, selectedMonth, 1);
      const end = new Date(selectedYear, selectedMonth + 1, 0);
      onChange({ start, end });
    } else if (mode === "year") {
      const start = new Date(selectedYear, 0, 1);
      const end = new Date(selectedYear, 11, 31);
      onChange({ start, end });
    }
  }, [mode]);

  const handleSelectWeek = (index: number) => {
    setSelectedWeekIndex(index);
    onChange({ start: weeks[index].start, end: weeks[index].end });
  };

  const handleSelectMonth = (month: number) => {
    setSelectedMonth(month);
    const start = new Date(selectedYear, month, 1);
    const end = new Date(selectedYear, month + 1, 0);
    onChange({ start, end });
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    onChange({ start, end });
  };

  let visibleLabel = "";
  if (mode === "week") visibleLabel = weeks[selectedWeekIndex]?.label;
  if (mode === "month")
    visibleLabel = `${months[selectedMonth]} ${selectedYear}`;
  if (mode === "year") visibleLabel = String(selectedYear);

  return (
    <View style={styles.wrapper}>
      <View style={styles.outerContainer}>
        <CalendarDays size={16} color="#4B5563" style={{ marginRight: 6 }} />
        <View style={styles.centerDisplay}>
          <Text numberOfLines={1} style={styles.centerLabel}>
            {visibleLabel}
          </Text>
          <ChevronDown size={14} color="#4B5563" style={{ marginLeft: 4 }} />
        </View>

        {/* Overlay Pickers */}
        {mode === "week" && (
          <Picker
            selectedValue={selectedWeekIndex}
            onValueChange={handleSelectWeek}
            style={styles.invisiblePicker}
          >
            {weeks.map((w, i) => (
              <Picker.Item key={i} label={w.label} value={i} />
            ))}
          </Picker>
        )}
        {mode === "month" && (
          <Picker
            selectedValue={selectedMonth}
            onValueChange={handleSelectMonth}
            style={styles.invisiblePicker}
          >
            {months.map((m, i) => (
              <Picker.Item key={i} label={`${m} ${selectedYear}`} value={i} />
            ))}
          </Picker>
        )}
        {mode === "year" && (
          <Picker
            selectedValue={selectedYear}
            onValueChange={handleSelectYear}
            style={styles.invisiblePicker}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = now.getFullYear() - i;
              return (
                <Picker.Item key={year} label={String(year)} value={year} />
              );
            })}
          </Picker>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "flex-end" },
  outerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 140,
  },
  centerDisplay: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  centerLabel: {
    color: "#1F2937",
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
  },
  invisiblePicker: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
  },
});
