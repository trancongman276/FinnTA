import { useEffect } from 'react';
import CardItem from './CardItem'
import '../../styles/Cards.scss'
import { Fade } from "react-awesome-reveal";
import talker from 'utils/talker';
import { useTypedSelector } from 'app/store';
import { useState } from 'react';
import { useCallback } from 'react';
import avatar from 'images/avatar.svg'

const gradientList = ['linear-gradient(180deg, #0191B4 0%, #35BBCA 100%)',
    'linear-gradient(180deg, #FE7A15 0%, #FFAF72 100%)',
    "linear-gradient(180deg, #A64DFF 0%, #C68BFF 100%)",
    "linear-gradient(108deg, rgba(248, 217, 15, 0.9) 1.48%, rgba(254, 122, 21, 0.9) 100%), #BCD1FF",
    "linear-gradient(180deg, #709CFF 0%, #64CDFF 100%)"]

type cardProps = {
    name?: string
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

var sort: "des" | "asc"
var by: "rate" | "name"

sort = "des"
by = "rate"
let page = 0

const Card = ({ name = undefined, setLoading = undefined }: cardProps) => {
    const [cards, setCards] = useState(<></>)
    const department = useTypedSelector(state => state.Department)
    const getCard = useCallback(async (name) => {
        setCards(<></>)
        if (setLoading)
            setLoading(true)
        if (name !== undefined) {
            sort = "asc"
            by = "name"
        }
        let TAList = await talker.TA.getSortTA(sort, by, 0, name)
        if (setLoading)
            setLoading(false)
        if (TAList.TA === undefined)
            return
        let tempCard = <>
            {TAList.TA.map((ta) => {
                let c_idLs = TAList.Class[ta._id]
                let res = c_idLs.map((c_id) => {
                    return Object.values(department.data).filter((d) => {
                        if (d.courses[c_id])
                            return true
                        return false
                    }).map((d) => {
                        return d.courses[c_id]
                    })
                }).flat()
                if (!ta.Avatar)
                    ta.Avatar = avatar
                return <CardItem
                    uid={ta._id}
                    avatar={ta.Avatar}
                    name={ta.Name}
                    major={department.data[ta.d_id!].name}
                    gpa={ta.GPA}
                    star={ta.Rate}
                    background={gradientList[0]}
                    color='#231F20'
                    listSubject={res}
                />
            })}
        </>
        setCards(tempCard)
    }, [department])
    useEffect(() => {
        console.log(name)

        if (Object.keys(department.data).length !== 0)
            getCard(name)
    }, [name])

    return (
        <Fade triggerOnce={true} duration={2300} direction="left">
            <div className='cards'>
                {name !== undefined ? <></> :
                    <><div className='text-container'>
                        <h1>Teaching Assistant Around You</h1>
                    </div>
                        <div className='text-container'>
                            <h3>Finding Tutor that suits with your requirement who are able to help you to boost up your marks</h3>
                        </div></>}

                <div className='cards-container'>
                    <div className='cards-wrapper'>
                        <div className='cards-items'>
                            {department.status === "idle" ? cards : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    )
}
export default Card