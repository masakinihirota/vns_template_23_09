import Footer from "@/components/nav/Footer"

// 動的レンダリングを強制します。
export const dynamic = "force-dynamic"

export default async function Index() {
  return (
    // 全体を縦にならべている、幅いっぱいに並べている
    <div className="">
      <h1>(04_list)\list</h1>
      <br />

      <Footer />
    </div>
  )
}
