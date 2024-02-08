import { FaHeart } from "react-icons/fa";
import { SiMaterialdesignicons } from "react-icons/si";
import { IoHome } from "react-icons/io5";
import { IoCheckbox } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa";
import { BsEmojiHeartEyesFill } from "react-icons/bs";
import { BsTriangleHalf } from "react-icons/bs";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { CgGirl } from "react-icons/cg";
export default function numberToIcons(num: number) {

    switch (num) {
        case 1:
            return <FaHeart size={25} />
        case 2:
            return <SiMaterialdesignicons size={25} />
        case 3:
            return <IoHome size={25} />
        case 4:
            return <IoCheckbox size={25} />
        case 5:
            return <BsEmojiHeartEyesFill size={25} />
        case 6:
            return <BsTriangleHalf size={25} />
        case 7:
            return <FaArrowAltCircleRight size={25} />
        case 8:
            return <CgGirl size={25} />
        default:
            return <FaQuestion size={25} />
    }
}