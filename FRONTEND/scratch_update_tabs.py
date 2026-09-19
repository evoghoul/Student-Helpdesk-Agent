import sys

file_path = r"c:\StudentHelpdesk\FRONTEND\src\app\admin\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the empty tab components at the bottom
target_text = """function AgentHealthTab() { return <div className="p-6">Agent Health Tab (WIP)</div>; }
function KanbanTab({ grievances, handleStatusUpdate }: any) { return <div className="p-6">Kanban Tab (WIP)</div>; }
function AuditTab() { return <div className="p-6">Audit Tab (WIP)</div>; }
function KnowledgeTab() { return <div className="p-6">Knowledge Tab (WIP)</div>; }"""

replacement_text = """
function AgentHealthTab() {
  return (
    <div className="p-6 bg-slate-50 min-h-[600px] flex flex-col gap-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Agent Health & Telemetry</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">System Uptime</div>
          <div className="text-2xl font-bold text-emerald-600">99.98%</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Avg Response Latency</div>
          <div className="text-2xl font-bold text-slate-900">840ms</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Hallucination Rate</div>
          <div className="text-2xl font-bold text-emerald-600">< 0.1%</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">API Token Usage (30d)</div>
          <div className="text-2xl font-bold text-slate-900">14.2M / 20M</div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex-1">
        <h3 className="font-semibold text-slate-800 mb-4">Live Sub-Agent Status</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-medium">Agent</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Last Sync</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50">
              <td className="py-3 font-medium">Support_Agent_65</td>
              <td className="py-3 text-slate-500">Frontline Triage</td>
              <td className="py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">ONLINE</span></td>
              <td className="py-3 text-slate-500">Just now</td>
            </tr>
            <tr className="border-b border-slate-50">
              <td className="py-3 font-medium">Nav_Agent_Omega</td>
              <td className="py-3 text-slate-500">Campus Maps & Routing</td>
              <td className="py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">ONLINE</span></td>
              <td className="py-3 text-slate-500">2m ago</td>
            </tr>
            <tr className="border-b border-slate-50">
              <td className="py-3 font-medium">Policy_Validator_9</td>
              <td className="py-3 text-slate-500">Compliance Checking</td>
              <td className="py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">ONLINE</span></td>
              <td className="py-3 text-slate-500">1m ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanbanTab({ grievances, handleStatusUpdate }: any) {
  const statuses = ['Pending', 'In Progress', 'Resolved'];
  return (
    <div className="p-6 bg-slate-50 min-h-[600px] flex flex-col h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Grievance Resolution Board</h2>
      <div className="flex gap-6 flex-1 overflow-x-auto pb-4">
        {statuses.map(status => (
          <div key={status} className="flex-1 min-w-[300px] bg-slate-100 rounded-xl p-4 flex flex-col">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
              {status}
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">
                {grievances.filter((g: any) => g.status === status).length}
              </span>
            </h3>
            <div className="flex flex-col gap-3 overflow-y-auto">
              {grievances.filter((g: any) => g.status === status).map((g: any) => (
                <div key={g.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <div className="text-xs font-bold text-blue-600 mb-1">{g.category}</div>
                  <div className="font-medium text-slate-900 mb-2">{g.description}</div>
                  <div className="text-xs text-slate-500 flex justify-between items-center mt-4">
                    <span>{g.student_id}</span>
                    {status !== 'Resolved' && (
                      <button 
                        onClick={() => handleStatusUpdate(g.id, status === 'Pending' ? 'In Progress' : 'Resolved')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Move →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditTab() {
  const auditLogs = [
    { id: 1, time: '10:42 AM', action: 'Distress Protocol Triggered', user: 'Agent 65', detail: 'Flagged chat #892 for manual review due to negative sentiment.' },
    { id: 2, time: '10:15 AM', action: 'Knowledge Base Queried', user: 'Agent 65', detail: 'Fetched policy: Hostel Leave Guidelines 2024.' },
    { id: 3, time: '09:30 AM', action: 'Automated Email Sent', user: 'System', detail: 'Sent resolution receipt to 21BEE092@student.edu.' },
    { id: 4, time: '08:00 AM', action: 'Database Backup', user: 'System', detail: 'Nightly automated backup completed successfully.' },
  ];
  return (
    <div className="p-6 bg-slate-50 min-h-[600px] flex flex-col gap-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">System Audit Logs</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Time</th>
              <th className="px-6 py-4 font-medium text-slate-500">Actor</th>
              <th className="px-6 py-4 font-medium text-slate-500">Action</th>
              <th className="px-6 py-4 font-medium text-slate-500">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{log.time}</td>
                <td className="px-6 py-4 font-medium">{log.user}</td>
                <td className="px-6 py-4 text-slate-800">{log.action}</td>
                <td className="px-6 py-4 text-slate-500">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KnowledgeTab() {
  return (
    <div className="p-6 bg-slate-50 min-h-[600px] flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Knowledge Base (RAG)</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Upload Document
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm md:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Indexed Documents</h3>
          <div className="space-y-3">
            {[
              { name: 'Student Code of Conduct 2024.pdf', tokens: '45k', status: 'Indexed' },
              { name: 'Hostel Rules & Regulations.pdf', tokens: '12k', status: 'Indexed' },
              { name: 'Fee Structure AY2024-25.xlsx', tokens: '8k', status: 'Indexed' },
              { name: 'Exam Rescheduling Policy.pdf', tokens: '15k', status: 'Indexing...' },
            ].map(doc => (
              <div key={doc.name} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">📄</div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{doc.name}</div>
                    <div className="text-xs text-slate-500">{doc.tokens} tokens</div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${doc.status === 'Indexed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm h-fit">
          <h3 className="font-semibold text-slate-800 mb-4">Vector DB Stats</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Total Vectors</span>
              <span className="font-bold text-slate-800">12,405</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Embedding Model</span>
              <span className="font-bold text-slate-800">text-embedding-3-small</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Vector Dimension</span>
              <span className="font-bold text-slate-800">1536</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-slate-500">Last Sync</span>
              <span className="font-bold text-slate-800">Today, 02:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"""

if target_text in content:
    new_content = content.replace(target_text, replacement_text)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully replaced tab contents.")
else:
    print("Target text not found in the file.")
