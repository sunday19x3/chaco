import axiosInstance from './axios'

export default async function getImage(url: string) {
  const response = await axiosInstance.get(url, {
    responseType: 'blob' // This tells axios to expect binary data
  })
  
  // Create object URL from the blob
  const imageUrl = URL.createObjectURL(response.data)
  return { data: imageUrl }
}
