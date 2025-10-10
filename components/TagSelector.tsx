import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

type Option = {
  id: number | string;
  name: string;
};

type Props = {
  options: Option[];
  multiSelect?: boolean;
  onChange: (id: number | string, selected: Option[] | Option | null) => void;
  defaultSelected?: Option[] | Option | null;
};

export default function GenericSelector({
  options,
  multiSelect = false,
  onChange,
  defaultSelected = multiSelect ? [] : null,
}: Props) {
  const [selected, setSelected] = useState<Option[] | Option | null>(
    defaultSelected
  );

  // ✅ Khi prop defaultSelected thay đổi (ví dụ khi mở trang edit)
  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const toggleSelect = (id: number | string) => {
    const opt = options.find((o) => o.id === id)!;

    if (multiSelect) {
      const current = (selected as Option[]) || [];
      const exists = current.find((x) => x.id === id);
      const newSelected = exists
        ? current.filter((x) => x.id !== id)
        : [...current, opt];
      setSelected(newSelected);
      onChange(id, newSelected);
    } else {
      const current = selected as Option | null;
      const newSelected = current?.id === id ? null : opt;
      setSelected(newSelected);
      onChange(id, newSelected);
    }
  };

  const isSelected = (id: number | string) =>
    multiSelect
      ? ((selected as Option[]) || []).some((s) => s.id === id)
      : (selected as Option | null)?.id === id;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row", gap: 8 }}
    >
      {options.map((opt) => {
        const active = isSelected(opt.id);
        return (
          <TouchableOpacity
            key={opt.id}
            className={`px-4 py-2 bg-[#E9EFFD] rounded-full border ${
              active ? "border-[#2563EB]" : "border-transparent"
            }`}
            onPress={() => toggleSelect(opt.id)}
          >
            <Text
              className={`font-[Montserrat-Medium] ${
                active ? "text-[#2563EB]" : "text-[#92B1F5]"
              }`}
            >
              {opt.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}