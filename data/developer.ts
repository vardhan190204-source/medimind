export type DeveloperRole = "Team Leader" | "Team Member";

export interface Developer {
  name: string;
  course: string;
  role: DeveloperRole;
  imageUrl: string | null;
}

export const developers: Developer[] = [
  {
    name: "Harsh Vardhan Srivastava",
    course: "MCA",
    role: "Team Leader",
    imageUrl:
      "https://i.makeagif.com/media/6-24-2025/Niit13.gif",
  },
  {
    name: "Chetan Tiwari",
    course: "MCA",
    role: "Team Member",
    imageUrl:
      "https://i.makeagif.com/media/3-09-2026/xsh6Tw.gif",
  },
  {
    name: "Vipin Yadav",
    course: "MCA",
    role: "Team Member",
    imageUrl:
      "https://i.pinimg.com/originals/b9/8e/62/b98e62635a81f7a68fa109aa17557f04.gif",
  },
  {
    name: "Abhshek Shukla",
    course: "B.TECH CSE",
    role: "Team Member",
    imageUrl: null,
  },
  {
    name: "Shanzee Khan",
    course: "B.Tech CSE",
    role: "Team Member",
    imageUrl:null,
  },
  {
    name: "Shristy Baske",
    course: "B.Tech CSE",
    role: "Team Member",
    imageUrl: null,
  },
];