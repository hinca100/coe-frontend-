import api from "./axios";

export interface Badge {
  _id: string;
  name: string;
  icon: string;
  courseId: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

export async function getMyBadges() {
  const { data } = await api.get<Badge[]>("/badges");
  return data;
}