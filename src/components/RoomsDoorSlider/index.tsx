import css from './index.module.css'

import { useRef, useState, useEffect, useContext } from 'react'

import Door from './Door'
import NavigationButton from './NavigationButton'
import Info from './Info'
import DoorList from '@components/RoomsDoorList'
import { MainframeContext } from '@components/Mainframe'


interface RoomsDoorSliderProps extends React.HTMLAttributes<HTMLDivElement> {
    mode: string
}

interface SliderFragmentProps
{
    indexAdd: number
    currentDoor: number
    scrollStagePercent: number
    selectedDoor: number
    doorRef: any
    over: number
}


const SliderFragment = (props: SliderFragmentProps) => {
    return (
        <>
            { [...Array(16)].map((item, index) => {
                let level = index + 1
                index += props.indexAdd
                return (
                    <div 
                        style={{
                            bottom:
                                props.currentDoor - 2 === index ? `${(100 - props.scrollStagePercent) / 100 * 10}px` :
                                props.currentDoor - 1 === index ? `${(100 - props.scrollStagePercent) / 100 * 40 + 10}px` :
                                props.currentDoor === index ? `${(100 - props.scrollStagePercent) / 100 * 26 + 50}px` :
                                props.currentDoor + 1 === index ? `${props.scrollStagePercent / 100 * 26 + 50}px` :
                                props.currentDoor + 2 === index ? `${props.scrollStagePercent / 100 * 40 + 10}px` :
                                props.currentDoor + 3 === index ? `${props.scrollStagePercent / 100 * 10}px` :
                                '0',
                            opacity:
                                index === props.selectedDoor ? 1 :
                                index === props.selectedDoor + 1 ? 0.9 :
                                index === props.selectedDoor - 1 ? 0.9 :
                                0.5
                        }} 
                        ref={index === 0 ? props.doorRef : null}
                        key={index}
                        className={css.slide}
                    >
                        <Door
                            level={level}
                            active={index === props.selectedDoor}
                            go={false}
                            over={ index-props.indexAdd === props.over-1 }
                        />
                    </div>
                )
            })}
        </>
    )
} 


const RoomsDoorSlider = (props: RoomsDoorSliderProps) => {
    const doorSlider = useRef<HTMLDivElement>(null)
    const doorSliderInner = useRef<HTMLDivElement>(null)
    const door = useRef<HTMLDivElement>(null)

    const [scrollStage, setScrollStage] = useState(0)
    const [scrollStagePercent, setScrollStagePercent] = useState(0)

    const [currentDoor, setCurrentDoor] = useState(0)
    const [selectedDoor, setSelectedDoor] = useState(0)

    const [currentDoorList, setCurrentDoorList] = useState(0)

    const context = useContext(MainframeContext)

    useEffect(()=>{
        if (null !== doorSliderInner.current && null !== doorSlider.current) {
            doorSlider.current.scroll({
                    left: doorSliderInner.current.offsetWidth / 3
            })

        }
    },[])


    const scrollHandler = () => {
        let
            doorWidth,
            scrollLeft,
            stage,
            stagePercent,
            current,
            selected

        if (null !== door.current) {
            doorWidth = door.current.offsetWidth
        }
        if (null !== doorSlider.current) {
            scrollLeft = doorSlider.current.scrollLeft
        }
        if (scrollLeft && doorWidth) {

            stage = scrollLeft % doorWidth
            stagePercent = stage / doorWidth * 100
            
            setScrollStagePercent(stagePercent)
            setScrollStage(stage)
            
            current = Math.floor(scrollLeft / doorWidth)
            selected = Math.floor(scrollLeft / doorWidth + (stage > doorWidth / 2 ? 1 : 0))
            
            setCurrentDoor(current)
            setSelectedDoor(selected)
            if (selected>=32 && stage < doorWidth / 2) {
                if (null !== doorSliderInner.current && null !== doorSlider.current) {
                    doorSlider.current.scroll({
                            left: doorSliderInner.current.offsetWidth / 3
                    })
                }
            }
            if (selected<16 && stage > doorWidth / 2) {
                if (null !== doorSliderInner.current && null !== doorSlider.current) {
                    doorSlider.current.scroll({
                        left: doorSliderInner.current.offsetWidth / 3 * 2 - doorWidth
                    })
                }
            }
        }
    }

    const scroll = (value: number) => {
        if (null !== doorSlider.current && null !== door.current) {
            doorSlider.current.scroll({
                left: 
                    doorSlider.current.scrollLeft +
                    value,
                behavior: "smooth",
            })
        }
    }

    const prevSlide = () => {
        if (null !== door.current) {
            if (scrollStage>1){
                scroll(-(scrollStage))
            } else {
                scroll(-(door.current.offsetWidth-scrollStage))
            }
        }
    }
    const nextSlide = () => {
        if (null !== door.current) {
            scroll(door.current.offsetWidth-scrollStage)
        }
    }

    return <div className={css.container}>
        <div
            onScroll={ scrollHandler }
            ref={ doorSlider }
            className={ [css.slider, props.mode !== 'slide' ? css.sliderHidden: ''].join(' ') }
        >
            <div ref={ doorSliderInner } className={css.inner}>
                <SliderFragment
                    indexAdd={0}
                    currentDoor={currentDoor}
                    selectedDoor={selectedDoor}
                    scrollStagePercent={scrollStagePercent}
                    doorRef={door}
                    over={context.gameOver}
                />
                <SliderFragment
                    indexAdd={16}
                    currentDoor={currentDoor}
                    selectedDoor={selectedDoor}
                    scrollStagePercent={scrollStagePercent}
                    doorRef={door}
                    over={context.gameOver}
                />
                <SliderFragment
                    indexAdd={32}
                    currentDoor={currentDoor}
                    selectedDoor={selectedDoor}
                    scrollStagePercent={scrollStagePercent}
                    doorRef={door}
                    over={context.gameOver}
                />
            </div>
            <NavigationButton
                className={ css.prevButton }
                onClick={ prevSlide }
            />
            <NavigationButton
                className={ css.nextButton }
                onClick={ nextSlide}
            />
        </div> 
        
        { props.mode === 'list' ? (
            <DoorList currentDoor={ currentDoorList } setCurrentDoor={ setCurrentDoorList }/>
        ) : ''}


        <Info
            available={234}
            empty={102}
            timeGame={'24+2'}
            hidden={ props.mode === 'list' ? !currentDoorList : props.mode === 'list' }
        />
    </div>
}


export default RoomsDoorSlider