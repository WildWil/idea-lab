import "./index.css";
import { Composition, Folder } from "remotion";
import { Shiplog, shiplogMetadata } from "./compositions/Shiplog";
import { Saveflow, saveflowMetadata } from "./compositions/Saveflow";
import { Clientloop, clientloopMetadata } from "./compositions/Clientloop";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="ads">
        <Composition
          id="Shiplog"
          component={Shiplog}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{ audioDurationInFrames: 180 }}
          calculateMetadata={shiplogMetadata}
        />
        <Composition
          id="Saveflow"
          component={Saveflow}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{ audioDurationInFrames: 180 }}
          calculateMetadata={saveflowMetadata}
        />
        <Composition
          id="Clientloop"
          component={Clientloop}
          durationInFrames={240}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={{ audioDurationInFrames: 180 }}
          calculateMetadata={clientloopMetadata}
        />
      </Folder>
    </>
  );
};
