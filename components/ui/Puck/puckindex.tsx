//unnecessary?

import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { DragDropContext, DragStart, DragUpdate } from "@hello-pangea/dnd";

import type { AppState, Config, Data, UiState } from "../../../types/Config";
import { Button } from "./button";

import { Plugin } from "../../../types/Plugin";
import { usePlaceholderStyle } from "../../../lib/use-placeholder-style";

// import { SidebarSection } from "../SidebarSection";
import { ChevronDown, ChevronUp, Globe, Sidebar } from "lucide-react";
// import { Heading } from "../Heading";
// import { IconButton } from "../IconButton/IconButton";
import { DropZoneProvider } from "../dropzonecon";
import { ItemSelector, getItem } from "../../../lib/get-item";
import { PuckAction, StateReducer, createReducer } from "../../../reducer";
import { flushZones } from "../../../lib/flush-zones";
import getClassNameFactory from "../../../lib/get-class-name-factory";
import { AppProvider, defaultAppState } from "./puckcon";
import { useResolvedData } from "../../../lib/use-resolved-data";
// import { MenuBar } from "../MenuBar";
import styles from "./styles.module.css";
import { Fields } from "./fields";
import { Components } from "./components";
import { Overrides } from "../../../types/Overrides";
import { loadOverrides } from "../../../lib/load-overrides";
import { usePuckHistory } from "../../../lib/use-puck-history";
import { useHistoryStore } from "../../../lib/use-history-store";

const getClassName = getClassNameFactory("Puck", styles);

export function Puck({
  children,
  config,
  data: initialData = { content: [], root: { props: { title: "" } } },
  ui: initialUi = defaultAppState.ui,
  onChange,
  onPublish,
  plugins = [],
  overrides = {},
  renderHeader,
  renderHeaderActions,
  headerTitle,
  headerPath,
}: {
  children?: ReactNode;
  config: Config<any, any, any>;
  data: Data;
  ui?: Partial<UiState>;
  onChange?: (data: Data) => void;
  onPublish?: (data: Data) => void;
  plugins?: Plugin[];
  overrides?: Partial<Overrides>;
  renderHeader?: (props: {
    children: ReactNode;
    dispatch: (action: PuckAction) => void;
    state: AppState;
  }) => ReactElement;
  renderHeaderActions?: (props: {
    state: AppState;
    dispatch: (action: PuckAction) => void;
  }) => ReactElement;
  headerTitle?: string;
  headerPath?: string;
}) {
  const historyStore = useHistoryStore();

  const [reducer] = useState(() =>
    createReducer({ config, record: historyStore.record })
  );

  const [initialAppState] = useState<AppState>(() => ({
    ...defaultAppState,
    data: initialData,
    ui: {
      ...defaultAppState.ui,
      ...initialUi,
      // Store categories under componentList on state to allow render functions and plugins to modify
      componentList: config.categories
        ? Object.entries(config.categories).reduce(
            (acc, [categoryName, category]) => {
              return {
                ...acc,
                [categoryName]: {
                  title: category.title,
                  components: category.components,
                  expanded: category.defaultExpanded,
                  visible: category.visible,
                },
              };
            },
            {}
          )
        : {},
    },
  }));

  const [appState, dispatch] = useReducer<StateReducer>(
    reducer,
    flushZones(initialAppState)
  );

  const { data, ui } = appState;

  const history = usePuckHistory({ dispatch, initialAppState, historyStore });

  const { resolveData, componentState } = useResolvedData(
    appState,
    config,
    dispatch
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const { itemSelector, leftSideBarVisible, rightSideBarVisible } = ui;

  const setItemSelector = useCallback(
    (newItemSelector: ItemSelector | null) => {
      if (newItemSelector === itemSelector) return;

      dispatch({
        type: "setUi",
        ui: { itemSelector: newItemSelector },
        recordHistory: true,
      });
    },
    [itemSelector]
  );

  const selectedItem = itemSelector ? getItem(itemSelector, data) : null;

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  const { onDragStartOrUpdate, placeholderStyle } = usePlaceholderStyle();

  const [draggedItem, setDraggedItem] = useState<
    DragStart & Partial<DragUpdate>
  >();

  // DEPRECATED
  const rootProps = data.root.props || data.root;

  // DEPRECATED
  useEffect(() => {
    if (Object.keys(data.root).length > 0 && !data.root.props) {
      console.error(
        "Warning: Defining props on `root` is deprecated. Please use `root.props`. This will be a breaking change in a future release."
      );
    }
  }, []);

  const toggleSidebars = useCallback(
    (sidebar: "left" | "right") => {
      const widerViewport = window.matchMedia("(min-width: 638px)").matches;
      const sideBarVisible =
        sidebar === "left" ? leftSideBarVisible : rightSideBarVisible;
      const oppositeSideBar =
        sidebar === "left" ? "rightSideBarVisible" : "leftSideBarVisible";

      dispatch({
        type: "setUi",
        ui: {
          [`${sidebar}SideBarVisible`]: !sideBarVisible,
          ...(!widerViewport ? { [oppositeSideBar]: false } : {}),
        },
      });
    },
    [dispatch, leftSideBarVisible, rightSideBarVisible]
  );

  useEffect(() => {
    if (!window.matchMedia("(min-width: 638px)").matches) {
      dispatch({
        type: "setUi",
        ui: {
          leftSideBarVisible: false,
          rightSideBarVisible: false,
        },
      });
    }

    const handleResize = () => {
      if (!window.matchMedia("(min-width: 638px)").matches) {
        dispatch({
          type: "setUi",
          ui: (ui) => ({
            ...ui,
            ...(ui.rightSideBarVisible ? { leftSideBarVisible: false } : {}),
          }),
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const defaultRender = useMemo<
    React.FunctionComponent<{ children?: ReactNode }>
  >(() => {
    const PuckDefault = ({ children }: { children?: ReactNode }) => (
      <>{children}</>
    );

    return PuckDefault;
  }, []);

  // Load all plugins into the overrides
  const loadedOverrides = useMemo(() => {
    return loadOverrides({ overrides, plugins });
  }, [plugins]);

  const disableZoom = children || loadedOverrides.puck ? true : false;

  return (
    <div>
      <AppProvider
        value={{
          state: appState,
          dispatch,
          config,
          componentState,
          resolveData,
          plugins,
          overrides: loadedOverrides,
          history,
        }}
      >
        <DragDropContext
          onDragUpdate={(update) => {
            setDraggedItem({ ...draggedItem, ...update });
            onDragStartOrUpdate(update);
          }}
          onBeforeDragStart={(start) => {
            onDragStartOrUpdate(start);
            setItemSelector(null);
            dispatch({ type: "setUi", ui: { isDragging: true } });
          }}
          onDragEnd={(droppedItem) => {
            setDraggedItem(undefined);
            dispatch({ type: "setUi", ui: { isDragging: false } });

            // User cancel drag
            if (!droppedItem.destination) {
              return;
            }

            // New component
            if (
              droppedItem.source.droppableId.startsWith("component-list") &&
              droppedItem.destination
            ) {
              const [_, componentType] = droppedItem.draggableId.split("::");

              dispatch({
                type: "insert",
                componentType: componentType || droppedItem.draggableId,
                destinationIndex: droppedItem.destination!.index,
                destinationZone: droppedItem.destination.droppableId,
              });

              setItemSelector({
                index: droppedItem.destination!.index,
                zone: droppedItem.destination.droppableId,
              });

              return;
            } else {
              const { source, destination } = droppedItem;

              if (source.droppableId === destination.droppableId) {
                dispatch({
                  type: "reorder",
                  sourceIndex: source.index,
                  destinationIndex: destination.index,
                  destinationZone: destination.droppableId,
                });
              } else {
                dispatch({
                  type: "move",
                  sourceZone: source.droppableId,
                  sourceIndex: source.index,
                  destinationIndex: destination.index,
                  destinationZone: destination.droppableId,
                });
              }

              setItemSelector({
                index: destination.index,
                zone: destination.droppableId,
              });
            }
          }}
        >
          <DropZoneProvider
            value={{
              data,
              itemSelector,
              setItemSelector,
              config,
              dispatch,
              draggedItem,
              placeholderStyle,
              mode: "edit",
              areaId: "root",
              disableZoom,
            }}
          >
          </DropZoneProvider>
        </DragDropContext>
      </AppProvider>
      <div id="puck-portal-root" />
    </div>
  );
}

Puck.Components = Components;
Puck.Fields = Fields;
