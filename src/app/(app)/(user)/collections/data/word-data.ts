// data/word-data.ts

export interface Word {
  word: string
  type: string
  meaning: string
  definitionEn: string
  definitionVi: string
  exampleEn: string
  exampleVi: string
}

export interface WordCollection {
  id: number
  title: string
  words: Word[]
  lastStudied: string
  createdAt: string
}

export const wordCollections: WordCollection[] = [
  {
    id: 1,
    title: "Technology",
    words: [
      {
        word: "algorithm",
        type: "noun",
        meaning: "thuật toán",
        definitionEn: "A set of rules for solving a problem in a finite number of steps.",
        definitionVi: "Một tập hợp các quy tắc để giải quyết một vấn đề trong số bước hữu hạn.",
        exampleEn: "Sorting data requires an efficient algorithm.",
        exampleVi: "Sắp xếp dữ liệu cần một thuật toán hiệu quả."
      },
      {
        word: "binary",
        type: "noun",
        meaning: "nhị phân",
        definitionEn: "A system of numerical notation that has 2 as its base.",
        definitionVi: "Một hệ thống ký hiệu số có cơ số là 2.",
        exampleEn: "Computers use binary to process information.",
        exampleVi: "Máy tính sử dụng nhị phân để xử lý thông tin."
      },
      {
        word: "debug",
        type: "verb",
        meaning: "gỡ lỗi",
        definitionEn: "To identify and fix errors in a computer program.",
        definitionVi: "Xác định và sửa lỗi trong một chương trình máy tính.",
        exampleEn: "Developers often debug code late into the night.",
        exampleVi: "Các lập trình viên thường gỡ lỗi mã vào khuya."
      },
      {
        word: "compile",
        type: "verb",
        meaning: "biên dịch",
        definitionEn: "To convert source code into machine code.",
        definitionVi: "Chuyển đổi mã nguồn thành mã máy.",
        exampleEn: "You need to compile the program before running it.",
        exampleVi: "Bạn cần biên dịch chương trình trước khi chạy nó."
      },
      {
        word: "interface",
        type: "noun",
        meaning: "giao diện",
        definitionEn: "A point where two systems meet and interact.",
        definitionVi: "Điểm mà hai hệ thống gặp nhau và tương tác.",
        exampleEn: "The user interface should be intuitive and simple.",
        exampleVi: "Giao diện người dùng nên trực quan và đơn giản."
      }
    ],
    lastStudied: "2d ago",
    createdAt: "01/10/2025",
  },
  {
    id: 2,
    title: "Business",
    words: [
      {
        word: "account",
        type: "noun",
        meaning: "tài khoản",
        definitionEn: "A record or statement of financial expenditure and receipts.",
        definitionVi: "Bản ghi hoặc báo cáo về chi tiêu và thu nhận tài chính.",
        exampleEn: "She opened a new bank account.",
        exampleVi: "Cô ấy đã mở một tài khoản ngân hàng mới."
      },
      {
        word: "balance",
        type: "noun",
        meaning: "số dư",
        definitionEn: "The amount of money available in an account.",
        definitionVi: "Số tiền còn lại trong một tài khoản.",
        exampleEn: "Check your balance before making a withdrawal.",
        exampleVi: "Kiểm tra số dư trước khi rút tiền."
      },
      {
        word: "revenue",
        type: "noun",
        meaning: "doanh thu",
        definitionEn: "The total income generated from sales or services.",
        definitionVi: "Tổng thu nhập tạo ra từ bán hàng hoặc dịch vụ.",
        exampleEn: "The company's revenue increased by 20% this quarter.",
        exampleVi: "Doanh thu của công ty tăng 20% trong quý này."
      },
      {
        word: "profit",
        type: "noun",
        meaning: "lợi nhuận",
        definitionEn: "The financial gain after deducting expenses from revenue.",
        definitionVi: "Lợi ích tài chính sau khi trừ chi phí khỏi doanh thu.",
        exampleEn: "They aim for a profit margin of at least 15%.",
        exampleVi: "Họ nhắm đến biên lợi nhuận ít nhất 15%."
      },
      {
        word: "investment",
        type: "noun",
        meaning: "đầu tư",
        definitionEn: "The action or process of investing money for profit.",
        definitionVi: "Hành động hoặc quá trình đầu tư tiền để sinh lời.",
        exampleEn: "Real estate is a popular form of investment.",
        exampleVi: "Bất động sản là hình thức đầu tư phổ biến."
      },
    ],
    lastStudied: "1d ago",
    createdAt: "02/10/2025",
  },
]
