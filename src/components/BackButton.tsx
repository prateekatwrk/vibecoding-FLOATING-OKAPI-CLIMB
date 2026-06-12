"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => navigate(-1)}
      className="flex items-center justify-start"
    >
      ← Back
    </Button>
  );
};