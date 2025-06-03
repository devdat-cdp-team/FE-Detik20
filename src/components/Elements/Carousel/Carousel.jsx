import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Carousel.module.css';

export default function Carousel({
    children, 
    titles, 
    width, 
    height, 
    style, 
    onScroll = [], 
    setCarouselPage, 
    scroll, 
    unlockedTab = []}
) {
    const [curPage, _setCurPage] = useState(0);
    const [carouselScale, setCarouselScale] = useState(1);
    const pageContainerRef = useRef(null);

    const curPageRef = useRef(curPage);

    let load = false;

    useEffect(() => { 
        // upadateHeight();
        // let pageHeight = parseInt(pageContainerRef.current.style.height.split('px')[0]);
        // pageContainerRef.current.style.maxScrollPosition = pageHeight - pageContainerRef.current.offsetHeight;
        // setCurPage(0)
        
        if (!load) {
            load = true;
            pageContainerRef.current.addEventListener('scroll', (e) => {scrollFunction()})
            setTimeout(() => {
                upadateHeight();
            }, 1000);
        }
    }, [])

    useEffect(() => {
        if (setCarouselPage) {
            setCarouselPage(curPage);
        }
        // console.log("height change, ", pageContainerRef.current.children[0].children, curPage, pageContainerRef.current.children[0].children[curPage])

        // pageContainerRef.current?.removeEventListener('scroll', scrollFunction, true)

        // pageContainerRef.current?.addEventListener('scroll',scrollFunc, true)

        upadateHeight();
        scrollFunction();
    }, [curPage])

    useEffect(() => {
        upadateHeight();
    }, [unlockedTab])

    useEffect(() => {
        if (scroll != 0 && pageContainerRef && pageContainerRef.current) {
            pageContainerRef.current.scrollTop += scroll
        }
    }, [scroll])

    const upadateHeight = () => {
        if (pageContainerRef.current && pageContainerRef.current.children[0].children[curPage]) {
            // console.log("height change 2", pageContainerRef.current.children[0].children[curPage].offsetHeight)
            pageContainerRef.current.children[0].style.height = `${pageContainerRef.current.children[0].children[curPage].offsetHeight + 30}px`;
        } else {
            setTimeout(() => {
                upadateHeight();
            }, 500);
        }
    }

    const setCurPage = (x) => {
        curPageRef.current = x; // Updates the ref
        _setCurPage(x);
    }

    const scrollFunction = useCallback(() => {
        let scroll = pageContainerRef.current.scrollTop;
        for (let i = 0 ; i < onScroll.length; i++) {
            onScroll[i](scroll, curPageRef.current);
        }
    }, [curPage])

    const onClickTitle = (page) => {
        setCurPage(page);

        if (pageContainerRef.current) {
            pageContainerRef.current.scrollTop = 0;
        }
    }

    return (
        <div className={`${styles.carouselContainer}`} style={{width: width, height: children[curPage]?.height+"px", ...style}}>
            <div className={`${styles.carouselTitleContainer}`}>
                {titles.map((e, index) => {
                    return (
                        <div className={`${styles.carouselTitle} ${curPage==index? styles.carouselTitleSelected: ''}`}
                            onClick={() => {if (unlockedTab[index]) {onClickTitle(index)}}}
                            style={{
                                width: `${width/titles.length}px`,
                                color: !unlockedTab[index] ? 'grey ': 'black',
                                cursor: unlockedTab[index] ? 'pointer ': 'inherit',
                            }}
                        >
                            {!unlockedTab[index]&&
                                <img src='assets/icons/lock_icon.svg' style={{color: 'grey'}}/>
                            }
                            {e}    
                        </div>
                    )
                })}
                <div className={`${styles.line}`} 
                    style={{
                        left: `${((((curPage)*2)+1) * width/(titles.length*2))- width/(titles.length*4)}px`, 
                        width: `${width/(titles.length*2)}px`,
                        
                    }}
                    
                />
            </div>
            <div 
                className={`${styles.carouselPageContainer}`} 
                style={{maxHeight:height}} 
                ref={pageContainerRef}
            >
                <div className={`${styles.carouselPageContainer}`} style={{marginLeft: (-curPage * width)+"px", overflow: 'hidden'}}>
                    {children.map((e, index) => {
                        return (
                            <div 
                                className={`${styles.carouselPage}`} 
                                style={{
                                    width: width,
                                }}

                            >
                                {e}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}