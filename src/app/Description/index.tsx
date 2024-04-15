import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from "react-router-dom";

const DescriptionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate('../')} >Back</Button>
    </div>
  );
};

export default DescriptionPage;
