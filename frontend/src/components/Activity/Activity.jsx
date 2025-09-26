import { BarChart2, Clock, Download, FileQuestionMarkIcon, Trash, Upload } from 'lucide-react'
import React from 'react'
import { actionColors } from '../../utils/activity.utils'
import RelativeTime from '../../components/RelativeTime/RelativeTime'

const Activity = ({theme, myActivities, slice}) => {
  return (
      <div>
                <div className="mt-8 ">
        {/* Activity Feed */}
        <div
          className={`rounded-2xl p-8 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gradient-to-br from-gray-900 to-black border border-green-900/30"
              : "bg-white shadow-lg"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Clock
              className={theme === "dark" ? "text-green-400" : "text-green-600"}
              size={24}
            />
            <h2
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {myActivities.slice(0, slice && typeof slice === "number" ? slice : myActivities.length).map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl transition-all border-b border-b-fuchsia-600 ${
                  theme === "dark"
                    ? "hover:bg-green-900/10"
                    : "hover:bg-green-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? `bg-${actionColors[item.color]}-900/30`
                        : `bg-${actionColors[item.color]}-100`
                    }`}
                  >
                    <span>
                      {item.action === "upload" ? (
                        <Upload size={24} color="rgba(0, 255, 100, 0.8)" />
                      ) : item.action === "delete" ? (
                        <Trash size={24} color="rgba(255, 0, 0, 0.8)" />
                      ) : item.action === "download" ? (
                        <Download size={24} color="rgba(0, 255, 0, 0.9)" />
                      ) : item.action === "analytics" ? (
                        <BarChart2 size={24} color="rgba(0, 255, 255, 0.8)" />
                      ) : (
                        <FileQuestionMarkIcon size={24} color="gray" />
                      )}
                    </span>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      <span className="text-[17px]">{item.description}</span>
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      <RelativeTime timestamp={item.createdAt} />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Activity;