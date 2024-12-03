import React, { useState } from "react";
import {
  Divider,
  Button,
  Flex,
  hubspot,
  Tile,
  Heading,
  Select,
  Text,
  TextArea,
  Checkbox,
} from "@hubspot/ui-extensions";

hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    sendAlert={actions.addAlert}
  />
));

const Extension = ({ context, runServerless, sendAlert }) => {
  const [satisfaction, setSatisfaction] = useState("");
  const [comments, setComments] = useState("");
  const [requiresFollowUp, setRequiresFollowUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!satisfaction) {
      sendAlert({ 
        message: "Please select a satisfaction level", 
        type: "warning"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Log the values being sent
      console.log('Sending values:', {
        satisfaction,
        comments,
        requiresFollowUp
      });

      const result = await runServerless({
        name: "myFunc",
        parameters: {
          satisfaction: String(satisfaction),
          comments: String(comments || ''),
          requiresFollowUp: requiresFollowUp,
        },
        propertiesToSend: ['hs_object_id'],
      });

      console.log('Received response:', result);

      sendAlert({ 
        message: "Submission successful",
        type: "success"
      });

      // Reset form
      setSatisfaction("");
      setComments("");
      setRequiresFollowUp(false);

    } catch (error) {
      console.error('Submission error:', error);
      sendAlert({ 
        message: "Submission failed",
        type: "danger"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tile>
        <Flex direction="column" gap="sm">
          <Heading>Internal Service Evaluation </Heading>
          <Text variant="microcopy">
          Thank you for documenting the customer's feedback.
           Please fill out the evaluation form below based on the
            service provided. Your input helps us track service quality, 
            identify areas for improvement, and ensure customer satisfaction. 
            If follow-up is required, be sure to indicate it in the form.
          </Text>
          <Select
            label="Satisfaction Level"
            required
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ]}
            value={satisfaction}
            onChange={(newValue) => setSatisfaction(newValue)}
          />

          <TextArea
            label="Comments"
            value={comments}
            onChange={(newValue) => setComments(newValue)}
          />

          <Flex alignItems="center" gap="sm">
            <Text>Requires Follow-up?</Text>
            <Checkbox
              checked={requiresFollowUp}
              onChange={() => setRequiresFollowUp(!requiresFollowUp)}
            />
          </Flex>
        </Flex>
      </Tile>
      
      <Flex justifyContent="flex-end" marginTop="md">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </Flex>
    </>
  );
};

export default Extension;