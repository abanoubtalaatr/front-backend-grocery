import { ChatIcon } from '@/components/ui/FormIcons';

export default function Cards() {
  return (
    <div className="flex flex-row justify-between gap-4 rounded-lg border border-black/20 bg-[#014162] p-4">
      <div className="flex flex-col gap-4 rounded-lg border border-black/20 bg-[#F7FCFF] p-4">
        <ChatIcon className="size-6" />
        <h2>Live chat</h2>
        <p className="text-sm text-gray-500">Chat with our support team</p>
        <p>Available 24/7</p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-black/20 bg-[#F7FCFF] p-4">
        <ChatIcon className="size-6" />
        <h2>Live chat</h2>
        <p className="text-sm text-gray-500">Chat with our support team</p>
        <p>Available 24/7</p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-black/20 bg-[#F7FCFF] p-4">
        <ChatIcon className="size-6" />
        <h2>Live chat</h2>
        <p className="text-sm text-gray-500">Chat with our support team</p>
        <p>Available 24/7</p>
      </div>
    </div>
  );
}
