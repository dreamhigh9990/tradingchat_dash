import React, { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import Messages from "./message/Messages";
import { useChatContext } from "@/context/chatContext";
import { useAuth } from "@/context/authContext";
import { AnimatePresence } from 'framer-motion';
import { ImageModal } from "@/components/ui/image-modal";
import ChatFooter from "./ChatFooter";

const Chat = () => {
  const { data, users, isRoom, selectedRoom } = useChatContext();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageData, setImageData] = useState(null);

  const isUserBlocked = users[currentUser?.uid]?.blockedUsers?.find(
    /**change back to data.user.uid to
     * instant crush user with blockedUsers added to database
    */
    (u) => u === currentUser?.uid
  );

  const IamBlocked = users[data?.user?.uid]?.blockedUsers?.find(
    (u) => u === currentUser?.uid
  );

  const openModal = (data) => {
    setIsModalOpen(true);
    setImageData(data);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-full">
      <ChatHeader />
      {!isRoom ?
        (<>
          <div className="chat-content parent-height">
            {data.chatId && (
              <>
                <Messages openModal={openModal} />

                {isUserBlocked && (
                  <div className="w-full text-center text-c3 py-5">
                    This user has been blocked
                  </div>
                )}

                {IamBlocked && (
                  <div className="w-full text-center text-c3 py-5">
                    {`${data.user.displayName} has blocked you!`}
                  </div>
                )}
              </>
            )}
          </div>
          {!isUserBlocked && !IamBlocked && <ChatFooter />}
        </>)
        : (<>
          <div className="chat-content parent-height">
            {selectedRoom && (
              <>
                <Messages openModal={openModal} />

                {/* {isUserBlocked && (
                  <div className="w-full text-center text-c3 py-5">
                    This user has been blocked
                  </div>
                )}

                {IamBlocked && (
                  <div className="w-full text-center text-c3 py-5">
                    {`${data.user.displayName} has blocked you!`}
                  </div>
                )} */}
              </>
            )}
          </div>
          {/* {!isUserBlocked && !IamBlocked && <ChatFooter />} */}
          <ChatFooter />
        </>)
      }

      <AnimatePresence>
        {isModalOpen && imageData && (
          <ImageModal imageData={imageData} closeModal={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
