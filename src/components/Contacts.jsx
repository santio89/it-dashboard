import { useState } from "react";
import { useGetContactsQuery, useGetContactsNextQuery } from "../store/slices/apiSlice";
import MainSection from "./MainSection"

function Contacts({ user }) {
  const [lastVisible, setLastVisible] = useState(null)

  const {
    data: { contacts: data, lastVisible: dataLastVisible } = {},
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    isSuccess: isSuccessData,
    isError: isErrorData,
    error: errorData,
  } = useGetContactsQuery(user?.uid);

  useGetContactsNextQuery({ userId: user?.uid, lastVisible });

  const handleRefetch = () => {
    setLastVisible(dataLastVisible)
  }


  return (
    <MainSection section="contacts" user={user} data={data} isLoadingData={isLoadingData} isFetchingData={isFetchingData} dataLastVisible={dataLastVisible} handleRefetch={handleRefetch} />
  )
}

export default Contacts