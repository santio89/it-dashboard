import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from '../hooks/useTranslation'
import autoAnimate from '@formkit/auto-animate'
import { setModal } from '../store/slices/modalSlice'

function SectionDataList({ section, user, data, dataList, isLoadingData, handleRefetch, dataLastVisible, firstLoad }) {
  const lang = useTranslation()
  const dispatch = useDispatch()
  const listContainer = useRef()

  useEffect(() => {
    !isLoadingData && dataList && listContainer.current && autoAnimate(listContainer.current)
  }, [listContainer, dataList, isLoadingData])

  return (
    isLoadingData ? <div className="loader">{lang.loading}...</div> :
      <div className="listWrapper">
        <ul className="items-list" ref={listContainer}>
          {
            dataList?.length === 0 ? <li className="no-data">{lang.noData}</li> :
              <>
                {
                  dataList?.map(contact =>
                    <li className={firstLoad && "firstLoad"} key={contact.localId}><button disabled={contact.id === "temp-id"} title={contact.name} onClick={() => { dispatch(setModal({ active: true, data: { modalType: `${section.charAt(0).toUpperCase() + section.slice(1)}DataModal`, userId: user?.uid, ...contact } })); }}>{contact.name}</button></li>)
                }
              </>
          }
        </ul>
        <div className="listWrapper__loadMore">
          <div>{lang.showing}: {dataList?.length} - {lang.total}: {data?.length}</div>
          {<button onClick={handleRefetch} disabled={!dataLastVisible}>{dataLastVisible ? `${lang.loadMore}...` : lang.allLoaded}</button>}
        </div>
      </div>
  )
}

export default SectionDataList