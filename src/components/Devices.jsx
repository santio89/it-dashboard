import { useState } from "react"
import { useGetDevicesQuery, useGetDevicesNextQuery } from "../store/slices/apiSlice"
import MainSection from "./MainSection"

function Devices({ user }) {
  const [lastVisible, setLastVisible] = useState(null)

  const {
    data: { devices: data, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    isSuccess: isSuccessData,
    isError: isErrorData,
    error: errorData,
  } = useGetDevicesQuery(user?.uid);

  useGetDevicesNextQuery({ userId: user?.uid, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }


  return (
    <MainSection section="devices" user={user} data={data} isLoadingData={isLoadingData} isFetchingData={isFetchingData} dataLastVisible={dataLastVisible} handleRefetch={handleRefetch} />
  )
}

export default Devices