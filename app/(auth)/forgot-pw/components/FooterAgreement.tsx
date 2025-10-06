import React from "react";
import { Text, View } from "react-native";

interface Props {
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

const FooterAgreement: React.FC<Props> = ({ onTermsPress, onPrivacyPress }) => {
  return (
    <View className="w-full items-center mt-auto mb-20 px-6">
      <Text className="text-[#ABABAB] text-sm text-center font-[Montserrat-Regular] leading-5">
        By using WordWise, you agree to the{"\n"}
        <Text
          className="font-[Montserrat-Bold] text-[#000]"
          onPress={onTermsPress}
        >
          Terms
        </Text>{" "}
        and{" "}
        <Text
          className="font-[Montserrat-Bold] text-[#000]"
          onPress={onPrivacyPress}
        >
          Privacy Policy
        </Text>
        .
      </Text>
    </View>
  );
};

export default FooterAgreement;