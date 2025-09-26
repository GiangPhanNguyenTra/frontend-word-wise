import { VocabularyShooterGame } from "@/components/games/VocabularyShooterGame";

const dailyWords = [
  { en: "adverse", vi: "bất lợi" },
  { en: "agent of change", vi: "tác nhân thay đổi" },
  { en: "analogue", vi: "vật tương tự, không kỹ thuật số" },
  { en: "arrive at sth", vi: "đưa ra kết luận" },
  { en: "be second to", vi: "thua kém" },
  { en: "be/come down to sth", vi: "là do" },
  { en: "beak", vi: "mỏ chim" },
  { en: "brain imaging", vi: "chụp hình não" },
  { en: "bulb", vi: "bóng đèn, củ (cây)" },
  { en: "cling (clung, clung)", vi: "níu giữ" },
  { en: "confined", vi: "hạn chế, giam giữ" },
  { en: "conscientious", vi: "có lương tâm, muốn làm điều tốt" },
  { en: "content", vi: "hài lòng (adj), nội dung (n)" },
  { en: "cortisol", vi: "một loại hoóc-môn tiết ra khi căng thẳng" },
  { en: "crate", vi: "thùng gỗ" },
  { en: "descent", vi: "sự đi xuống, nguồn gốc (dòng dõi)" },
  { en: "destined", vi: "được định sẵn" },
  { en: "dwell", vi: "sống, suy nghĩ nhiều về" },
  { en: "effectively", vi: "hiệu quả, thực chất" },
  { en: "evacuate", vi: "sơ tán" },
  { en: "famished", vi: "rất đói" },
  { en: "feed", vi: "thức ăn, feed MXH, cung cấp" },
  { en: "ferret", vi: "chồn" },
  { en: "flightless", vi: "không bay được" },
  { en: "flourish", vi: "thịnh vượng" },
  { en: "frame a message", vi: "diễn đạt một thông điệp" },
  { en: "fraud", vi: "vụ/kẻ lừa đảo" },
  { en: "frond", vi: "lá dương xỉ/cọ" },
  { en: "fungus", vi: "nấm" },
  { en: "hedge", vi: "né tránh (v), hàng rào cây (n)" },
  { en: "heighten", vi: "tăng cường" },
  { en: "horticulture", vi: "nghề làm vườn" },
  { en: "incubation", vi: "ấp trứng, ủ bệnh, phát triển ý tưởng" },
  { en: "ingrained", vi: "ăn sâu, khó thay đổi" },
  { en: "instance", vi: "trường hợp" },
  { en: "justify", vi: "chứng minh" },
  { en: "keel", vi: "(hàng hải) sống đáy tàu" },
  { en: "leap", vi: "nhảy vọt" },
  { en: "life-threatening", vi: "nguy hiểm đến tính mạng" },
  { en: "neural", vi: "thuộc về thần kinh" },
  { en: "news alert", vi: "thông báo notification" },
  { en: "offset", vi: "bù đắp, cân bằng" },
  { en: "on sb’s doorstep", vi: "gần sát bên" },
  { en: "on the face of it", vi: "thoạt nhìn" },
  { en: "panel", vi: "ban giám khảo, bảng điều khiển, miếng chữ nhật" },
  {
    en: "perceived threat",
    vi: "mối đe doạ trong suy nghĩ, chưa chắc là thật",
  },
  { en: "picture", vi: "tưởng tượng" },
  { en: "practically", vi: "gần như" },
  { en: "pre-programmed", vi: "được lập trình sẵn" },
  { en: "precarious", vi: "bấp bênh" },
  { en: "prospect", vi: "triển vọng, viễn cảnh" },
  { en: "rear", vi: "phía sau (n), nuôi dưỡng (v)" },
  { en: "sanctuary", vi: "nơi trú ẩn an toàn" },
  { en: "settler", vi: "người khai hoang" },
  { en: "sighting", vi: "sự bắt gặp (động vật, UFO)" },
  { en: "slit", vi: "rạch, cắt (v), khe hở (n)" },
  { en: "solitary", vi: "đơn độc" },
  { en: "spike", vi: "gai nhọn, sự tăng vọt" },
  { en: "stakeholder", vi: "bên liên quan" },
  { en: "stay with sb", vi: "khiến ai nhớ mãi" },
  { en: "stoat", vi: "một loại chồn" },
  { en: "stock", vi: "hàng hoá, cổ phiếu, dự trữ" },
  { en: "strain", vi: "(gây) căng thẳng, chủng loại" },
  { en: "succumb to sth", vi: "khuất phục bởi, chết vì" },
  { en: "supplementary", vi: "bổ sung, thêm vào" },
  { en: "take hold", vi: "bắt đầu có tác dụng" },
  { en: "take in sth/sb", vi: "tiếp thu, cho ai ở nhờ, lừa ai" },
  { en: "take notice of", vi: "chú ý đến" },
  { en: "tense up", vi: "trở nên căng thẳng" },
  { en: "uplifting", vi: "khích lệ tinh thần" },
  { en: "vascular", vi: "thuộc mạch máu/thực vật mạch" },
  { en: "vigilant", vi: "cảnh giác" },
  { en: "virulent", vi: "độc hại" },
  { en: "weasel", vi: "lẩn tránh (v), con chồn (n)" },
  { en: "weigh up sth", vi: "cân nhắc" },
  { en: "well-suited to sth", vi: "phù hợp với" },
  { en: "wilt", vi: "héo úa" },
  { en: "withstand", vi: "chịu đựng" },
];
export default function MinigamePage() {
  return (
    <div className="flex flex-col items-center justify-center py-8 w-full ">
      {dailyWords && dailyWords.length > 0 ? (
        <VocabularyShooterGame wordsToReview={dailyWords} />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">No words to review today!</h2>
          <p className="text-muted-foreground">
            Come back tomorrow for a new set of vocabulary.
          </p>
        </div>
      )}
    </div>
  );
}
