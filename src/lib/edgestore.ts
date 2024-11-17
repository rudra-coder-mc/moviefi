"use client";
import { createEdgeStoreProvider } from "@edgestore/react";
import { type EdgeStoreRouter } from "./edgstoreType";

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();

export { EdgeStoreProvider, useEdgeStore };
