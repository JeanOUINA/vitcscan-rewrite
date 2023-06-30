import React from "react";
import usePromise from "../hooks/usePromise";
import viteapi from "../viteapi";

export default function AddressName({
    address,
    Component = ({name}:{name: string}) => <>{name}</>
}:{
    address: string,
    Component?: React.FC<{name: string}>
}){
    const [, name] = usePromise(() => {
        return viteapi.getAddressName(address)
    }, [address])

    if(!name)return null

    return <Component name={name} />
}