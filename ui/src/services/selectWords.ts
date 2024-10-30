import axiosInstance from "@/tools/axios";
import {
  failureResponseParser,
  successResponseParser,
} from "@/utils/responseParser";

const selectWords = async () => {
  try {
    const response = await axiosInstance.get<SelectWordsResponse[]>("/words");
    return successResponseParser<SelectWordsResponse[]>(response);
  } catch (err) {
    return failureResponseParser<SelectWordsResponse[]>(err);
  }
};

export default selectWords;
