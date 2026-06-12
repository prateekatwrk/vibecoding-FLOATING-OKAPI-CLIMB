"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => navigate(-1)}
      className={className}
    >
      ← Back
    </Button>
  );
};

export default BackButton;