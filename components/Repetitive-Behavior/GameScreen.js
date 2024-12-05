import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

const storyStages = [
  [
    "Once upon a time, there was a brave princess who",
    "set out on a journey to save her kingdom from a wicked dragon.",
    "Along the way, she met a wise old woman who gave her a magic sword.",
  ],
  [
    "With the sword in hand, the princess faced the dragon",
    "and emerged victorious, saving her kingdom and its people.",
    "The grateful citizens celebrated her bravery with a grand feast.",
  ],
  [
    "Years passed, and the princess became a wise and just queen.",
    "She ruled her kingdom with compassion and strength,",
    "always remembering the lessons she learned on her great adventure.",
  ],
  [
    "And so, the kingdom flourished under her reign,",
    "becoming a beacon of hope and prosperity for all who lived there.",
    "The end.",
  ],
];

const DraggableSentence = ({ sentence, index, onDragEnd, isInTopSection, onRemove, onRearrange }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      if (isInTopSection) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (isInTopSection) {
        translateY.value = withSpring(0);
        translateX.value = withSpring(0);
        runOnJS(onRearrange)(index, event.absoluteY);
      } else {
        translateY.value = withSpring(0);
        runOnJS(onDragEnd)(index, event.absoluteY);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: isInTopSection ? translateX.value : 0 },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View 
        style={[
          styles.sentence, 
          animatedStyle, 
          isInTopSection && styles.topSentence
        ]}
      >
        <Text style={styles.sentenceText}>{sentence}</Text>
        {isInTopSection && (
          <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(index)}>
            <Feather name="x" color="#fff" size={16} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const StoryScreen = () => {
  const [bottomSentences, setBottomSentences] = useState([]);
  const [topSentences, setTopSentences] = useState([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const topScrollViewRef = useRef(null);
  const bottomScrollViewRef = useRef(null);

  const startCall = () => {
    setIsCallStarted(true);
    resetStage(0);
  };

  const resetStage = (stage) => {
    const allSentences = storyStages.slice(0, stage + 1).flat();
    setBottomSentences([...allSentences].sort(() => Math.random() - 0.5));
    setTopSentences([]);
  };

  const handleDragEnd = (index, yPosition) => {
    if (yPosition < height * 0.6) {
      // Move to top section
      const movedSentence = bottomSentences[index];
      setTopSentences([...topSentences, movedSentence]);
      setBottomSentences(bottomSentences.filter((_, i) => i !== index));
    }
  };

  const removeSentence = (index) => {
    const removedSentence = topSentences[index];
    setTopSentences(topSentences.filter((_, i) => i !== index));
    setBottomSentences([...bottomSentences, removedSentence]);
  };

  const rearrangeSentences = (fromIndex, yPosition) => {
    const toIndex = Math.min(
      Math.max(Math.floor((yPosition - height * 0.1) / 50), 0),
      topSentences.length - 1
    );
    if (fromIndex !== toIndex) {
      const newTopSentences = [...topSentences];
      const [reorderedItem] = newTopSentences.splice(fromIndex, 1);
      newTopSentences.splice(toIndex, 0, reorderedItem);
      setTopSentences(newTopSentences);
    }
  };

  const checkAnswer = () => {
    const currentStageSentences = storyStages.slice(0, currentStage + 1).flat();
    const isCorrect = topSentences.every((sentence, index) => sentence === currentStageSentences[index]);
    
    if (isCorrect) {
      if (currentStage < storyStages.length - 1) {
        const nextStage = currentStage + 1;
        setCurrentStage(nextStage);
        resetStage(nextStage);
        alert(`Correct! Moving to stage ${nextStage + 1}.`);
      } else {
        alert("Congratulations! You've completed all stages!");
      }
    } else {
      alert("That's not quite right. Try again!");
      resetStage(currentStage);
    }
  };

  const stopAttempt = () => {
    setIsCallStarted(false);
    setCurrentStage(0);
    setTopSentences([]);
    setBottomSentences([]);
  };

  const restartAttempt = () => {
    setCurrentStage(0);
    resetStage(0);
  };

  if (!isCallStarted) {
    return (
      <View style={styles.container}>
        <Button title="Start Game" onPress={startCall} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.stageIndicator}>
        <Text style={styles.stageText}>Stage: {currentStage + 1} / {storyStages.length}</Text>
      </View>
      <View style={styles.topSection}>
        <ScrollView ref={topScrollViewRef} showsVerticalScrollIndicator={true}>
          {topSentences.map((sentence, index) => (
            <DraggableSentence
              key={`top-${index}`}
              sentence={sentence}
              index={index}
              onDragEnd={() => {}}
              isInTopSection={true}
              onRemove={removeSentence}
              onRearrange={rearrangeSentences}
            />
          ))}
        </ScrollView>
        <View style={styles.floatingButtonsContainer}>
          <TouchableOpacity style={styles.floatingButton} onPress={checkAnswer}>
            <Feather name="check" color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingButton} onPress={restartAttempt}>
            <Feather name="rotate-ccw" color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingButton} onPress={stopAttempt}>
            <Feather name="x" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <ScrollView ref={bottomScrollViewRef} showsVerticalScrollIndicator={true}>
          {bottomSentences.map((sentence, index) => (
            <DraggableSentence
              key={`bottom-${index}`}
              sentence={sentence}
              index={index}
              onDragEnd={handleDragEnd}
              isInTopSection={false}
              onRemove={() => {}}
              onRearrange={() => {}}
            />
          ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  stageIndicator: {
    padding: 10,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  stageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  topSection: {
    height: '60%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  bottomSection: {
    height: '40%',
    padding: 10,
  },
  sentence: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSentence: {
    backgroundColor: '#e6f7ff',
  },
  sentenceText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default StoryScreen;