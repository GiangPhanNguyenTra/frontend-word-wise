import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onComplete }) => {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "");
    if (!digit) return;

    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    // focus sang ô tiếp theo
    if (index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    const joined = newValues.join("");
    if (joined.length === length) {
      onComplete(joined);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !values[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="w-full flex-row justify-between space-x-2">
      {values.map((val, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            inputs.current[i] = ref;
          }}
          value={val}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          className="w-20 h-14 border border-gray-400 rounded-lg text-center text-lg bg-white mr-2"
        />
      ))}
    </View>
  );
};

export default OTPInput;
