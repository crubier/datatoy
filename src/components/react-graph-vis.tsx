// import React, { Component } from "react";
// import defaultsDeep from "lodash/fp/defaultsDeep";
// import isEqual from "lodash/isEqual";
// import differenceWith from "lodash/differenceWith";
// import { DataSet } from "vis-data";
// import { Network, Options, NetworkEvents } from "vis-network";

// export type Props = {
//   identifier?: string;
//   graph: Network;
//   options: Options;
//   events: Record<NetworkEvents, () => void>;
//   style: React.StyleHTMLAttributes<HTMLDivElement>;
//   getNetwork: (n: Network) => any;
//   getNodes: () => any;
//   getEdges: () => any;
// };

// export type State = {
//   identifier: string;
// };

// class Graph extends Component<Props, State> {
//   container: React.Ref<HTMLDivElement>;
//   edges: DataSet<any, string>;
//   nodes: DataSet<any, string>;
//   network?: Network;

//   constructor(props: Props) {
//     super(props);
//     const { identifier } = props;
//     this.updateGraph = this.updateGraph.bind(this);
//     this.state = {
//       identifier:
//         identifier !== undefined
//           ? identifier
//           : "" + Math.floor(Math.random() * 1000000000),
//     };
//     this.container = React.createRef();
//     this.edges = new DataSet();
//     this.nodes = new DataSet();
//   }

//   componentDidMount() {
//     this.edges = new DataSet();
//     this.edges.add(this.props.graph.edges);
//     this.nodes = new DataSet();
//     this.nodes.add(this.props.graph.nodes);
//     this.updateGraph();
//   }

//   shouldComponentUpdate(nextProps: Props, nextState: State) {
//     let nodesChange = !isEqual(this.props.graph.nodes, nextProps.graph.nodes);
//     let edgesChange = !isEqual(this.props.graph.edges, nextProps.graph.edges);
//     let optionsChange = !isEqual(this.props.options, nextProps.options);
//     let eventsChange = !isEqual(this.props.events, nextProps.events);

//     if (nodesChange) {
//       const idIsEqual = (n1, n2) => n1.id === n2.id;
//       const nodesRemoved = differenceWith(
//         this.props.graph.nodes,
//         nextProps.graph.nodes,
//         idIsEqual
//       );
//       const nodesAdded = differenceWith(
//         nextProps.graph.nodes,
//         this.props.graph.nodes,
//         idIsEqual
//       );
//       const nodesChanged = differenceWith(
//         differenceWith(nextProps.graph.nodes, this.props.graph.nodes, isEqual),
//         nodesAdded
//       );
//       this.patchNodes({ nodesRemoved, nodesAdded, nodesChanged });
//     }

//     if (edgesChange) {
//       const edgesRemoved = differenceWith(
//         this.props.graph.edges,
//         nextProps.graph.edges,
//         isEqual
//       );
//       const edgesAdded = differenceWith(
//         nextProps.graph.edges,
//         this.props.graph.edges,
//         isEqual
//       );
//       const edgesChanged = differenceWith(
//         differenceWith(nextProps.graph.edges, this.props.graph.edges, isEqual),
//         edgesAdded
//       );
//       this.patchEdges({ edgesRemoved, edgesAdded, edgesChanged });
//     }

//     if (optionsChange) {
//       this.network?.setOptions?.(nextProps.options);
//     }

//     if (eventsChange) {
//       let events = this.props.events || {};
//       for (let eventName of Object.keys(events))
//         this.network?.off(
//           eventName as NetworkEvents,
//           events[eventName as NetworkEvents]
//         );

//       events = nextProps.events || {};
//       for (let eventName of Object.keys(events))
//         this.network?.on(
//           eventName as NetworkEvents,
//           events[eventName as NetworkEvents]
//         );
//     }

//     return false;
//   }

//   componentDidUpdate() {
//     this.updateGraph();
//   }

//   patchEdges({ edgesRemoved, edgesAdded, edgesChanged }) {
//     this.edges.remove(edgesRemoved);
//     this.edges.add(edgesAdded);
//     this.edges.update(edgesChanged);
//   }

//   patchNodes({ nodesRemoved, nodesAdded, nodesChanged }) {
//     this.nodes.remove(nodesRemoved);
//     this.nodes.add(nodesAdded);
//     this.nodes.update(nodesChanged);
//   }

//   updateGraph() {
//     let defaultOptions = {
//       physics: {
//         stabilization: false,
//       },
//       autoResize: false,
//       edges: {
//         smooth: false,
//         color: "#000000",
//         width: 0.5,
//         arrows: {
//           to: {
//             enabled: true,
//             scaleFactor: 0.5,
//           },
//         },
//       },
//     };

//     // merge user provied options with our default ones
//     let options = defaultsDeep(defaultOptions, this.props.options);

//     this.network = new Network(
//       this.container.current,
//       {
//         ...this.props.graph,
//         edges: this.edges,
//         nodes: this.nodes,
//       },
//       options
//     );

//     if (this.props.getNetwork) {
//       this.props.getNetwork(this.network);
//     }

//     if (this.props.getNodes) {
//       this.props.getNodes(this.nodes);
//     }

//     if (this.props.getEdges) {
//       this.props.getEdges(this.edges);
//     }

//     // Add user provied events to network
//     let events = this.props.events || {};
//     for (let eventName of Object.keys(events)) {
//       this.network.on(eventName, events[eventName]);
//     }
//   }

//   render() {
//     const { identifier } = this.state;
//     const { style } = this.props;
//     return (
//       <div id={identifier} ref={this.container} style={style}>
//         {identifier}
//       </div>
//     );
//   }
// }

// export default Graph;
export {};
