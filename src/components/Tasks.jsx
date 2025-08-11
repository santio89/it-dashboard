import { useState } from "react";
import { useGetTdlQuery, useGetTdlNextQuery } from "../store/slices/apiSlice";
import MainSection from "./MainSection"

function Tasks({ user }) {
  const [lastVisible, setLastVisible] = useState(null)

  const {
    data: { tasks: data, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    isSuccess: isSuccessData,
    isError: isErrorData,
    error: errorData,
  } = useGetTdlQuery(user.uid);


  useGetTdlNextQuery({ userId: user?.uid, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }

  return (
    <MainSection section="tasks" user={user} data={data} isLoadingData={isLoadingData} isFetchingData={isFetchingData} dataLastVisible={dataLastVisible} handleRefetch={handleRefetch} />
  )
}

export default Tasks