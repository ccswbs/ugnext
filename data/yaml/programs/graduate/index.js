import types from "./types.yml";
import degrees from "./degrees.yml";
import programs from "./programs.yml";

export const getTypes = async () => {
  return types.reduce((map, type) => {
    map.set(type.id, type);
  }, new Map());
};

export const getDegrees = async () => {
  return degrees.reduce((map, degree) => {
    map.set(degree.id, degree);
  }, new Map());
};

export const getPrograms = async () => {
  return programs;
};
