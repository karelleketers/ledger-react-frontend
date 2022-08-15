import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LOAD_CATEGORIES_SECTION} from "../../../../GraphQL/Queries";
import SVG from 'react-inlinesvg';
import {ReactComponent as BackIcon} from './../../../../assets/images/back.svg';
import {ReactComponent as NextIcon} from './../../../../assets/images/next.svg';
import moment from 'moment'
import { useWindowDimensions } from "../../../Hooks";

interface Category {
    id: number,
    name: string,
    current: number, 
    total: number,
    hidden: boolean | string,
    categoryIconId?: null | number,
    iconName?: string,
    categoryIcon: { name: string },
    updatedAt: Date
}

export const CategoriesSection = () => {
    //query for fetching categories data
    const {loading, data: queryData} = useQuery(LOAD_CATEGORIES_SECTION);
    const [pos, setPos] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [posText, setPosText] = useState(0);
    const { width } = useWindowDimensions();

    useEffect(() => {
        queryData && setTotalCount(queryData.getCategoriesList.length)
    }, [queryData]);

    const handlePosClick = (change : number):void => {
        /**these conditions are hard to read, but mathematically they're correct. 
         * If position is below 0 then adjust to 0. 
         * If position is at 0 or above 0 then as long as the position (+ 3, to adjust for showing 3 extra cats) is below the total count of categores, adjust the position by change. The exception would be at position 0 where it can't go back a position (to -1) and instead will remain at position 0. 
         * If position + 3 is equal to totalcount then the position can only go down or must remain the same (depends on whether change is positive or negative);
         * finally, this new position will push the category slideshow in the correct direction (based on position) with the exception of the last category where the slideshow's visibility will only be altered enough to show the last category in full 
        */
        if (width > 1098) {
            const newPos = pos >= 0 ? pos + 3 < totalCount ? (pos === 0 && change < 0) ? pos : pos + change : change > 0 ? pos : pos > 0 ? pos + change : pos : 0;
            //this is a bit hacky, but easiest way to dynamically alter style (this sets by how much the wrapper of categories needs to translate left or right depending on position relative to total number of categories)
            (newPos + 3 < totalCount ? setPosText(-(newPos * 30)) : (newPos + 3 === totalCount && totalCount > 3) ? setPosText(-(((newPos-1) * 30) + 10)) : setPosText(0));
            setPos(newPos);

        //2.5
        } else if (width < 1098 && width >= 768) {
            const newPos = pos >= 0 ? pos + 2 < totalCount ? (pos === 0 && change < 0) ? pos : pos + change : change > 0 ? pos : pos > 0 ? pos + change : pos : 0;
            (newPos + 2 < totalCount ? setPosText(-(newPos * 42)) : (newPos + 2 === totalCount && totalCount > 2) ? setPosText(-(((newPos-1) * 42) + 16)) : setPosText(0));
            setPos(newPos);

        //2
        } else if (width < 768 && width >= 547) {
            const newPos = pos >= 0 ? pos + 2 < totalCount ? (pos === 0 && change < 0) ? pos : pos + change : change > 0 ? pos : pos > 0 ? pos + change : pos : 0;
            (newPos + 2 <= totalCount && totalCount > 2 && setPosText(-(newPos * 60)));
            setPos(newPos);

        //1
        } else if (width < 547) {
            const newPos = pos >= 0 ? pos + 1 < totalCount ? (pos === 0 && change < 0) ? pos : pos + change : change > 0 ? pos : pos > 0 ? pos + change: pos : 0;
            (newPos + 1 <= totalCount && totalCount > 1 && setPosText(-(newPos * 100)));
            setPos(newPos);
        }
        
    };

    return (
        <div className="flex flex-wrap my-12 w-full xlb:max-w-75 m-auto">
            <button className={`w-1/10 ${pos < 1 && "cursor-default"}`} onClick={() => handlePosClick(-1)}>
                <BackIcon className={`lg:w-12 lg:h-12 m-auto fill-light duration-200 ${pos < 1 ? "opacity-20" : "opacity-70 hover:opacity-100"}`}/>
            </button>
            <div className="overflow-hidden w-4/5 h-64 relative m-auto">
                <div className='w-full h-full'>
                <ul style={{transform: `translateX(${posText}%)`,}} className="flex flex-row duration-500">
                    {loading && <div>...Loading</div>}
                    {queryData && queryData.getCategoriesList.map((category: Category) => {
                        return (
                        <li className={`flex-none relative rounded-4xl bg-ltgreen xl:bg-dkgreen mx-cat-mobile md:ml-0 md:mr-1/5 md:w-category-sm lg:w-category-med lg:mr-1/10 h-64 w-cat-mobile xl:w-category xl:max-w-48 text-dkgreen xl:text-ltgreen ${category.current <= 0 && "opacity-40"}`} key={category.id}>
                                <div className="grid grid-rows-15 px-4 w-full h-full bg-cat-mobile xl:bg-category bg-opacity-10 rounded-4xl absolute">
                                    <div className="row-span-6 flex flex-wrap items-end">
                                        <SVG src={`../icons/${category.categoryIcon.name}.svg`} className="w-18 h-18 fill-dark xl:fill-light opacity-60 relative" />
                                    </div>
                                    <p className="row-span-4 flex flex-wrap content-end font-nunitomedium text-lg py-2">{category.name}</p>
                                    <p className="row-span-3 text-light font-nunitoblack text-3xl">{`€ ${(category.current/100).toFixed(2).replace('.', ',')}`}</p>
                                    <p className='row-span-2 font-nunitoreg text-micro'>last updated <span>{moment(category.updatedAt).fromNow()}</span></p>
                                </div>
                        </li>)
                        })}
                </ul>
                </div>
            </div>
            <button className={`w-1/10 ${((width >= 1098 && pos >= totalCount - 3) || (width >= 768 && width < 1098 && pos >= totalCount - 2) || (width >= 547 && width < 768 && pos >= totalCount - 2) || (width < 768 && pos >= totalCount - 1)) && "cursor-default"}`} onClick={() => {handlePosClick(1)}}>
                <NextIcon className={`lg:w-12 lg:h-12 m-auto fill-light duration-200 ${((width >= 1098 && pos < totalCount - 3) || (width >= 768 && width < 1098 && pos < totalCount - 2) || (width >= 547 && width < 768 && pos < totalCount - 2) || (width < 547 && pos < totalCount - 1)) ? "opacity-70 hover:opacity-100" : "opacity-20" }`}/>
            </button>
        </div>
    )
}

