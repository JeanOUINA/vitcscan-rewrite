import { Table, TableBody, TableContainer, TableRow } from "@mui/material";
import TableCellBorderTop from "../TableCellBorderTop";
import usePromise from "../../hooks/usePromise";
import { tokensMap } from "../../vite";

export default function AddressCardBalance(){
    const [, tokens] = usePromise(() => {
        return tokensMap
    }, [])
    return <TableContainer>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCellBorderTop>Apagnan</TableCellBorderTop>
                    <TableCellBorderTop>t'as les cramptés ?</TableCellBorderTop>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
}