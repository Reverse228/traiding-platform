import { ComponentType, memo, useMemo } from "react";
import { AdvancedRealTimeChartProps } from "react-ts-tradingview-widgets";

import { useSearchParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const Chart = () => {
  const searchParams = useSearchParams();

  const AdvancedRealTimeChart: ComponentType<AdvancedRealTimeChartProps> =
    dynamic(
      () =>
        import("react-ts-tradingview-widgets").then(
          (w) => w.AdvancedRealTimeChart,
        ),
      {
        ssr: false,
      },
    );

  const MemoizedAdvancedRealTimeChart = memo(AdvancedRealTimeChart);

  const pairs = searchParams.get("pair")?.split("-");
  const type = searchParams.get("type");

  const graphData =
    type && pairs && (type === "index" ? pairs[0] : `${pairs[0]}${pairs[1]}`);

  const memoizedGraphData = useMemo(() => graphData, [graphData]);

  return (
    <div
      className={
        "w-full h-[600px] mt-6 overflow-hidden border rounded-lg box-border p-2"
      }
    >
      {memoizedGraphData ? (
        <AdvancedRealTimeChart
          theme="dark"
          hide_side_toolbar
          autosize
          copyrightStyles={{
            parent: { display: "none" },
          }}
          disabled_features={[
            "header_symbol_search",
            "compare_symbol",
            "border_around_the_chart",
            "header_indicators",
            "border_around_the_chart",
          ]}
          allow_symbol_change={false}
          symbol={memoizedGraphData}
          save_image={false}
        />
      ) : (
        <Skeleton className={"w-full h-[600px] "} />
      )}
    </div>
  );
};

export default Chart;
