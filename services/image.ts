import axiosInstance from './axios'

export default async function getImage(url: string) {
  return await axiosInstance.get(url)
}
