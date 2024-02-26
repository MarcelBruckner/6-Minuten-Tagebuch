import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import moment, { Moment } from 'moment';

interface CustomPickerDayProps extends PickersDayProps<Moment> {
    isSelected: boolean;
    isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
    borderRadius: 0,
    ...(isSelected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.main,
        },
    }),
    ...(isHovered && {
        backgroundColor: theme.palette.primary[theme.palette.mode],
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary[theme.palette.mode],
        },
    }),
    ...(day.day() === 1 && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
    ...(day.day() === 0 && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Moment, dayB: Moment | null | undefined) => {
    if (dayB == null) {
        return false;
    }

    return dayA.isSame(dayB, 'week');
};

function Day(
    props: PickersDayProps<Moment> & {
        selectedDay?: Moment | null;
        hoveredDay?: Moment | null;
    },
) {
    const { day, selectedDay, hoveredDay, ...other } = props;

    return (
        <CustomPickersDay
            {...other}
            day={day}
            sx={{ px: 2.5 }}
            disableMargin
            selected={false}
            isSelected={isInSameWeek(day, selectedDay)}
            isHovered={isInSameWeek(day, hoveredDay)}
        />
    );
}

export default function WeekPicker() {
    const [hoveredDay, setHoveredDay] = React.useState<Moment | null>(null);
    const [value, setValue] = React.useState<Moment | null>(moment('2022-04-17'));

    return (
        <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
            showDaysOutsideCurrentMonth
            displayWeekNumber

            slots={{ day: Day }}
            slotProps={{
                day: (ownerState) =>
                ({
                    selectedDay: value,
                    hoveredDay,
                    onPointerEnter: () => setHoveredDay(ownerState.day),
                    onPointerLeave: () => setHoveredDay(null),
                } as any),
            }}
        />
    );
}