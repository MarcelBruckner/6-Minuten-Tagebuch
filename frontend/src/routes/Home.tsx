import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
    const [cookies] = useCookies(['token'])
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.token) {
            navigate("/signin");
        }
    })

    return <h1>Welcome home!</h1>
}