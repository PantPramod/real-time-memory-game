import numberToIcons from "../numberToIcons"

type propTypes = {
    value: number,
    isOpen?: boolean
}

const Box = ({ value, isOpen }: propTypes) => {
    if (value === 0) {
        return (
            <div className="empty">

            </div>
        )
    }
    return (
        <div
            className="flip-card pointer">
            <div
                style={{ transform: `rotateY(${isOpen ? 180 : 0}deg)` }}
                className="flip-card-inner">
                <div className="flip-card-front box"></div>
                <div className="flip-card-back box">{numberToIcons(value)}</div>
            </div>
        </div>
    )
}

export default Box
