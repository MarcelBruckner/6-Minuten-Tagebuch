import { Daily, DailyService, OpenAPI, Weekly, WeeklyService } from "../client";
import EintraegeListDailyCard from "../components/EintraegeListDailyCard";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import EintraegeListWeeklyCard from "../components/EintraegeListWeeklyCard";
import { formatDate, formatWeek, parseDate } from "../common/Helpers";


export default function Home() {
    const [eintraege, setEintraege] = useState<Array<Daily | Weekly>>([])
    const [cookies] = useCookies(['sechs_minuten_tagebuch_token'])
    const navigate = useNavigate();

    function isDaily(value: Daily | Weekly): value is Daily {
        return value.hasOwnProperty('datum');
    }

    function isWeekly(value: Daily | Weekly): value is Weekly {
        return value.hasOwnProperty('woche');
    }

    async function getEintraege() {
        const values: Array<Daily | Weekly> = [];
        try {
            const response = await DailyService.dailyGetDailiesInDateRange({})
            values.push(...response);
        } catch (e) {
        }
        try {
            const response = await WeeklyService.weeklyGetWeekliesInDateRange({})
            values.push(...response);
        } catch (e) {
        }
        const sorted = values.sort((a: Daily | Weekly, b: Daily | Weekly) => {
            if (isDaily(a) && isDaily(b)) {
                return a.datum.localeCompare(b.datum);
            } else if (isDaily(a) && isWeekly(b)) {
                return (a.datum).localeCompare(b.woche);
            } else if (isWeekly(a) && isDaily(b)) {
                const diff = formatDate(parseDate(a.woche).add(6, 'days')).localeCompare(b.datum);
                if (diff === 0) {
                    return 1;
                }
                return diff;
            } else if (isWeekly(a) && isWeekly(b)) {
                return a.woche.localeCompare(b.woche);
            }
            throw new Error(`Unsupported compare of ${a} and ${b}`)
        }).reverse();
        setEintraege(sorted);
    }

    useEffect(() => {
        if (!cookies.sechs_minuten_tagebuch_token) {
            navigate("/signin");
            return;
        }
        OpenAPI.TOKEN = cookies.sechs_minuten_tagebuch_token;

        getEintraege();
        // eslint-disable-next-line
    }, [])


    return <>
        {
            eintraege.map((eintrag) => {
                if (isDaily(eintrag)) {
                    return <EintraegeListDailyCard daily={eintrag} key={eintrag.datum} />
                } else if (isWeekly(eintrag)) {
                    return <EintraegeListWeeklyCard weekly={eintrag} key={formatWeek(eintrag.woche)} />
                }
                return <></>
            }
            )
        }
    </>
}
