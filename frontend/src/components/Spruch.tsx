import Container from "@mui/material/Container";

export default function Spruch(props: { value: string | undefined }) {
    return <Container className="spruch" maxWidth="sm">
        <h1><i>{props.value}</i></h1>
    </Container>
}