"use client"

import { CartesianGrid, XAxis, BarChart, Bar } from "recharts"
import { Label, Pie, PieChart } from "recharts"
import { Line, LineChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { totalPresencasType } from "@/types/presencasType"
import { pontuacaoEstagiario } from "@/types/pontuacaoTypes"
import { userRole } from "@/types/userTypes"

type SquadPointsChartProps = {
  data: pontuacaoEstagiario[]
}

export function SquadPointsChart({ data }: SquadPointsChartProps) {
  const chartConfig = {
    points: {
      label: "Pontos",
      color: "#002346",
    },
  } satisfies ChartConfig;

  const [timeRange, setTimeRange] = React.useState("180d");

  // Calcular data de início e fim
  const getStartAndEndDates = (timeRange: string) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(1); // Primeiro dia do mês atual

    const daysToSubtract = timeRange === "90d" ? 90 : 180;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return { startDate, endDate: today };
  };

  const { startDate, endDate } = getStartAndEndDates(timeRange);

  // Gerar intervalo de meses
  const generateMonthsInRange = (startDate: Date, endDate: Date) => {
    const months = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      months.push({ mes: currentDate.getMonth() + 1, ano: currentDate.getFullYear() });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months;
  };

  const monthsInRange = generateMonthsInRange(startDate, endDate);

  // Agrupar dados por estagiário
  const groupedData = data.reduce((acc, item) => {
    const key = `${item.idEstagiario}-${item.nome} ${item.sobreNome}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof data>);

  // Completar dados ausentes para cada estagiário
  const completeDataByIntern = Object.entries(groupedData).map(([key, items]) => {
    const completedData = monthsInRange.map(({ mes, ano }) => {
      const existingItem = items.find((item) => item.mes === mes && item.ano === ano);
      return {
        mes,
        ano,
        value: existingItem?.pontuacaoTotal || 0,
      };
    });

    return {
      name: key.split("-")[5], // Extrair nome do estagiário
      data: completedData,
    };
  });

  // Gerar cores únicas para cada estagiário
  const colors = [
    "#002346", // Cor 1 (azul escuro, principal)
    "#FF6F61", // Cor 2 (laranja, boa para contraste com azul)
    "#4CAF50", // Cor 3 (verde, contraste vibrante com o azul escuro)
    "#FFC107", // Cor 4 (dourado, boa visibilidade sobre fundo branco)
    "#2196F3", // Cor 5 (azul claro, combina bem com o azul escuro e com bom contraste)
    "#9C27B0", // Cor 6 (roxo, contraste forte com o azul escuro)
  ];

  // Adicionando um pequeno offset para evitar sobreposição de linhas
  const getOffset = (index: number) => {
    return index * 0.5; // Ajuste o valor conforme necessário para um bom espaçamento
  };

  // Estruturar os dados para o gráfico com offset
  const chartData = monthsInRange.map(({ mes, ano }) => {
    const monthLabel = new Date(ano, mes - 1).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    });

    const entry: Record<string, number | string> = { date: monthLabel };
    completeDataByIntern.forEach(({ name, data }, index) => {
      const monthData = data.find((item) => item.mes === mes && item.ano === ano);
      entry[name] = (monthData?.value || 0) + getOffset(index);  // Adicionando o offset
    });

    return entry;
  });

  return (
    <Card className="shadow-md w-full sm:w-full m-0 sm:mr-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="font-poppins">Pontuação do squad</CardTitle>
          <CardDescription className="font-poppins">
            Compare os pontos de cada membro do squad.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] filtro-pontuacao-squad-4 rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Últimos 6 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="180d" className="rounded-lg">
              Últimos 6 meses
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[270px] w-full"
        >
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={({ payload, label }) => {
                if (payload && payload.length) {
                  return (
                    <div className="bg-white shadow-md p-2 rounded text-sm">
                      <strong>{label}</strong> {/* Exibe o mês/ano */}
                      {payload.map((entry, index) => {
                        const userColor = colors[index % colors.length];
                        return (
                          <div key={`tooltip-${index}`}>
                            <span className="font-bold" style={{ color: userColor }}>
                              {entry.name}: </span>
                            {entry.value} pontos {/* Exibe o valor dos pontos */}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />

            {completeDataByIntern.map(({ name }, index) => (
              <Line
                key={name}
                dataKey={name}  // Usando o nome do estagiário
                type="monotone"
                stroke={colors[index % colors.length]}  // Cor da linha
                strokeWidth={2}  // Definindo a largura da linha
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


type PointsChartProps = SquadPointsChartProps & {
  role: userRole
}

export const PointsChart = ({ data, role }: PointsChartProps) => {
  const getLastSixMonthsData = (pointsData: pontuacaoEstagiario[]) => {
    // Obter os últimos 6 meses a partir da data atual
    const now = new Date();
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        formatted: date.toLocaleString("pt-BR", { month: "short" }),
      };
    }).reverse();

    // Combinar os meses com os dados reais, preenchendo com 0 se necessário
    return lastSixMonths
      .map(({ month, year, formatted }) => {
        const entry = pointsData.find(
          (item) => item.mes === month && item.ano === year
        );
        return entry
          ? { month: formatted, points: entry.pontuacaoTotal }
          : null; // Excluir meses sem dados
      })
      .filter(Boolean); // Remover colunas que não possuem dados
  };

  const chartDataFrequency = getLastSixMonthsData(data);

  const chartConfig = {
    points: {
      label: "Pontos",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col shadow-md p-4 w-full sm:w-[620px] mr-0 h-[270px]">
      <div className="grid flex-1 gap-1 text-center sm:text-left">
        <CardTitle className="text-lg font-poppins">{role === "Estagiario" ? "Seus pontos nos últimos meses" : "Pontuação do estagiário nos últimos meses"}</CardTitle>
      </div>
      <CardContent className={`h-full ${chartDataFrequency.length === 0 ? "flex items-center justify-center" : ""}`}>
        {chartDataFrequency.length > 0 ? (
          <ChartContainer config={chartConfig} className="max-h-full pl-0">
            <BarChart width={250} height={200} data={chartDataFrequency}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="points" fill={"#1984c5"} radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-center">Nenhum dado disponível nos últimos 6 meses.</p>
        )}
      </CardContent>
    </Card>
  );
};

type FrequencyChartProps = {
  data: totalPresencasType
  role: userRole
}

export const FrequencyChart = ({ data, role }: FrequencyChartProps) => {
  // Dados para o gráfico baseado em presenças, faltas e atrasos
  const chartDataPoints = [
    { label: "Presenças", value: data ? data.totalPresencas : 0, fill: "var(--color-presencas)" },
    { label: "Faltas", value: data ? data.totalFaltas : 0, fill: "var(--color-faltas)" },
    { label: "Atrasos", value: data ? data.totalAtrasos : 0, fill: "var(--color-atrasos)" },
  ];

  const chartConfigPoints = {
    presencas: {
      label: "Presenças",
      color: "#014E9B",
    },
    faltas: {
      label: "Faltas",
      color: "#B22222",
    },
    atrasos: {
      label: "Atrasos",
      color: "#FFC107",
    },
  };

  return (
    <Card className="flex flex-col p-6 shadow-md w-full sm:w-[620px] mr-0 h-[270px]">
      <div className="grid flex-1 gap-1 text-center sm:text-left">
        <CardTitle className="text-lg font-poppins">{role === "Estagiario" ? "Sua frequência" : "Frequência do estagiário nos últimos meses"}</CardTitle>
      </div>
      <CardContent className="h-full">
        <ChartContainer
          config={chartConfigPoints}
          className={`mx-auto aspect-square max-h-[200px]`}
        >
          {data && data.diasLetivos > 0 ? <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartDataPoints}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data.diasLetivos}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Dias Letivos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart> : <div className="w-full h-full flex justify-center items-center p-6 pt-0">

            <p className="text-center">Nenhuma Presença</p>
          </div>}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}