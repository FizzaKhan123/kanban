"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Board from "../../components/Board";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
       <Board />
    </ProtectedRoute>)
 
}
