import { useState } from "react";
import { useGetSupportQuery, useGetSupportNextQuery } from "../store/slices/apiSlice";
import MainSection from "./MainSection"

function Support({ user }) {
  const [lastVisible, setLastVisible] = useState(null)

  const {
    data: { tickets: data, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    isSuccess: isSuccessData,
    isError: isErrorData,
    error: errorData,
  } = useGetSupportQuery(/* user.domainAdmin ? "admin" : */ user.email);

  useGetSupportNextQuery({ userEmail: user?.email, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }

  return (
    <MainSection section="support" user={user} data={data} isLoadingData={isLoadingData} isFetchingData={isFetchingData} dataLastVisible={dataLastVisible} handleRefetch={handleRefetch} />
  )
}

export default Support