// src/features/doc/data/groups.ts
import type GroupType from "@/types/GroupType";

const groups: GroupType[] = [
  {
    title: "Materia 1",
    links: [
      { label: "Tópico 1", to: "/docs/materia1/topico1" },
      { label: "Tópico 2", to: "/docs/materia1/topico2" }
    ]
  }
];

export default groups;
