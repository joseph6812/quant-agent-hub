import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <Navbar />

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">免责声明</h1>
          <p className="text-muted-foreground">
            请仔细阅读以下条款，使用本网站即表示您同意以下内容
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                投资风险提示
              </h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  1. <strong>历史业绩不代表未来表现</strong>：本网站展示的所有策略回测数据均为历史表现，不构成对未来收益的承诺或保证。金融市场具有不确定性，过去的表现不能预测未来的结果。
                </p>
                <p>
                  2. <strong>投资有风险</strong>：使用任何量化策略进行实盘交易都存在风险，包括但不限于市场风险、流动性风险、模型风险等。投资者应根据自身情况独立判断，自行承担投资风险。
                </p>
                <p>
                  3. <strong>本金损失风险</strong>：量化交易可能导致部分或全部本金损失，请确保您了解并接受这一风险后再进行实盘交易。
                </p>
              </div>
            </section>

            <hr />

            <section>
              <h2 className="text-lg font-semibold mb-3">服务性质声明</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  1. <strong>非投资建议</strong>：本网站提供的所有内容，包括但不限于策略代码、回测报告、技术文章等，仅供学习研究使用，不构成任何投资建议或买卖推荐。
                </p>
                <p>
                  2. <strong>非投资咨询</strong>：本网站不提供证券投资咨询服务，不具备证券投资咨询业务资格。网站运营者与用户之间不存在任何投资顾问关系。
                </p>
                <p>
                  3. <strong>开源性质</strong>：本网站所有策略代码均采用开源协议发布，用户可自由下载、学习、修改，但需自行承担使用风险。
                </p>
              </div>
            </section>

            <hr />

            <section>
              <h2 className="text-lg font-semibold mb-3">内容责任声明</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  1. <strong>内容准确性</strong>：本网站尽力确保所提供信息的准确性，但不保证内容的完整性、准确性、可靠性或及时性。对于因使用本网站内容而产生的任何损失，本网站不承担任何责任。
                </p>
                <p>
                  2. <strong>用户生成内容</strong>：本网站策略由用户上传，网站运营者不对用户上传内容的真实性、合法性负责。如发现违规内容，请及时举报。
                </p>
                <p>
                  3. <strong>第三方链接</strong>：本网站可能包含指向第三方网站的链接，对于这些网站的内容和安全性，本网站不承担任何责任。
                </p>
              </div>
            </section>

            <hr />

            <section>
              <h2 className="text-lg font-semibold mb-3">使用规范</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  1. <strong>合法使用</strong>：用户应遵守相关法律法规，不得将本网站内容用于非法目的，包括但不限于操纵市场、内幕交易等违法行为。
                </p>
                <p>
                  2. <strong>自行判断</strong>：用户应基于自身独立判断使用本网站内容，不应盲目跟随任何策略或建议。
                </p>
                <p>
                  3. <strong>风险自担</strong>：用户使用本网站策略进行实盘交易的风险和后果由用户自行承担，本网站及策略作者不承担任何责任。
                </p>
              </div>
            </section>

            <hr />

            <section>
              <h2 className="text-lg font-semibold mb-3">知识产权</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  1. <strong>开源协议</strong>：本网站策略代码默认采用MIT开源协议，用户可自由使用、修改、分发，但需保留原作者版权声明。
                </p>
                <p>
                  2. <strong>版权归属</strong>：用户上传的策略代码版权归上传者所有，上传者授权本网站展示和分发。
                </p>
                <p>
                  3. <strong>侵权处理</strong>：如认为本网站内容侵犯您的知识产权，请联系我们，我们将及时处理。
                </p>
              </div>
            </section>

            <hr />

            <section>
              <h2 className="text-lg font-semibold mb-3">免责声明更新</h2>
              <p className="text-sm text-muted-foreground">
                本网站保留随时更新本免责声明的权利，更新后的声明将在本页面公布。继续使用本网站即表示您同意更新后的声明内容。
              </p>
            </section>

            <div className="bg-muted p-4 rounded-lg mt-6">
              <p className="text-sm text-center">
                <strong>最后更新日期：</strong>2025年4月6日
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t py-8 px-4 mt-16">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 QuantAgent Hub. 仅供学习交流，不构成投资建议。</p>
        </div>
      </footer>
    </div>
  );
}
