import { Container } from "semantic-ui-react"
import Header from "./Header"

export default ({ children }) => {
    return (
        <Container>
            <Header /> <br />
            <main>{children} </main>
        </Container>
    )
}
