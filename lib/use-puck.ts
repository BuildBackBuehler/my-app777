import { useAppContext } from "@measured/puck";

export const usePuck = () => {
  const { state: appState, config, dispatch } = useAppContext();

  return { appState, config, dispatch };
};
