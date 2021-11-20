import { useState } from "react";

const useToggle = (initial: boolean): [boolean, () => void] => {
    const [value, setValue] = useState(initial)

    const toggleValue = () => {
        setValue(!value)
    }

    return [value, toggleValue]
}

export default useToggle