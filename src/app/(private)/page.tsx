import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Home() {
  return (
    <Tabs defaultValue="events" className="w-full">
      <TabsList className="bg-slate-850">
        <TabsTrigger value="events" className="cursor-pointer">Meus eventos</TabsTrigger>
        <TabsTrigger value="participations" className="cursor-pointer">Eventos que participo</TabsTrigger>
      </TabsList>

      <TabsContent value="events">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data / hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Local</TableHead>
              <TableHead className="text-right">Participantes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Palestra Prof. Dr. João Silva</TableCell>
              <TableCell>14/09/2025 10:00h</TableCell>
              <TableCell>Agendado</TableCell>
              <TableCell>Auditório Principal UFRJ</TableCell>
              <TableCell className="text-right">50</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="participations">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data / hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Local</TableHead>
              <TableHead className="text-right">Participantes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">Simpósio de Inovações em I.A.</TableCell>
              <TableCell>16/09/2025 15:00h</TableCell>
              <TableCell>Agendado</TableCell>
              <TableCell>Sala de Congresso da USP</TableCell>
              <TableCell className="text-right">250</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  )
}
