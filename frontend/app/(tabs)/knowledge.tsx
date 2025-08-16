import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextInput } from '@/components/TextInput';
import { Card } from '@/components/ui/Card';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  author: string;
  authorType: 'expert' | 'experienced_mom' | 'family';
  likes: number;
  isBookmarked: boolean;
  publishedAt: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export default function KnowledgeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: Category[] = [
    { id: 'nutrition', name: '营养饮食', icon: '🍎', count: 24 },
    { id: 'health', name: '健康护理', icon: '💊', count: 18 },
    { id: 'exercise', name: '孕期运动', icon: '🤸‍♀️', count: 12 },
    { id: 'psychology', name: '心理健康', icon: '💆‍♀️', count: 15 },
    { id: 'preparation', name: '分娩准备', icon: '🏥', count: 20 },
    { id: 'baby_care', name: '新生儿护理', icon: '👶', count: 16 },
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: '孕期营养搭配的小窍门',
      summary: '合理的营养搭配对孕妇和胎儿都非常重要，这里分享一些实用的搭配技巧...',
      category: '营养饮食',
      readTime: '5分钟',
      author: '王奶奶',
      authorType: 'experienced_mom',
      likes: 128,
      isBookmarked: true,
      publishedAt: '2天前',
    },
    {
      id: '2',
      title: '如何缓解孕期焦虑情绪',
      summary: '孕期情绪波动是正常现象，学会正确的调节方法可以帮助准妈妈度过这个特殊时期...',
      category: '心理健康',
      readTime: '8分钟',
      author: '李医生',
      authorType: 'expert',
      likes: 96,
      isBookmarked: false,
      publishedAt: '1周前',
    },
    {
      id: '3',
      title: '胎动规律及异常情况识别',
      summary: '了解正常的胎动模式，及时发现异常情况，是每个准妈妈都应该掌握的知识...',
      category: '健康护理',
      readTime: '6分钟',
      author: '张医生',
      authorType: 'expert',
      likes: 156,
      isBookmarked: true,
      publishedAt: '3天前',
    },
    {
      id: '4',
      title: '准爸爸陪伴指南',
      summary: '作为准爸爸，如何更好地陪伴和支持妻子度过孕期，这些经验值得学习...',
      category: '家庭关怀',
      readTime: '7分钟',
      author: '志明',
      authorType: 'family',
      likes: 89,
      isBookmarked: false,
      publishedAt: '5天前',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 实际应用中这里会触发搜索API
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleArticleAction = (articleId: string, action: string) => {
    Alert.alert('文章操作', `${action}功能正在开发中...`);
  };

  const getAuthorTypeColor = (type: Article['authorType']) => {
    switch (type) {
      case 'expert':
        return colors.primary;
      case 'experienced_mom':
        return colors.secondary;
      default:
        return colors.success;
    }
  };

  const getAuthorTypeLabel = (type: Article['authorType']) => {
    switch (type) {
      case 'expert':
        return '专家';
      case 'experienced_mom':
        return '有经验的妈妈';
      default:
        return '家庭成员';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 页面标题和搜索 */}
        <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            孕期知识
          </ThemedText>
          
          <TextInput
            placeholder="搜索知识文章..."
            value={searchQuery}
            onChangeText={handleSearch}
            leftIcon="🔍"
            variant="filled"
            size="large"
            containerStyle={styles.searchContainer}
          />
        </ThemedView>

        <View style={styles.content}>
          {/* 知识分类 */}
          <Card variant="default" style={styles.categoriesCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                📚 知识分类
              </ThemedText>
            </View>
            
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: selectedCategory === category.id
                        ? colors.primary + '20'
                        : colors.backgroundSecondary,
                      borderColor: selectedCategory === category.id
                        ? colors.primary
                        : colors.border,
                    }
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <ThemedText style={styles.categoryIcon}>
                    {category.icon}
                  </ThemedText>
                  <ThemedText style={[styles.categoryName, { color: colors.text }]}>
                    {category.name}
                  </ThemedText>
                  <ThemedText style={[styles.categoryCount, { color: colors.textSecondary }]}>
                    {category.count}篇
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </Card>

          {/* 推荐文章 */}
          <Card variant="default" style={styles.articlesCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                ⭐ 推荐阅读
              </ThemedText>
            </View>
            
            <View style={styles.articlesList}>
              {articles.map((article) => (
                <Pressable
                  key={article.id}
                  style={[styles.articleItem, { borderColor: colors.border }]}
                  onPress={() => handleArticleAction(article.id, '阅读文章')}
                >
                  <View style={styles.articleContent}>
                    <View style={styles.articleHeader}>
                      <View style={styles.articleMeta}>
                        <View style={[styles.authorBadge, { backgroundColor: getAuthorTypeColor(article.authorType) + '20' }]}>
                          <ThemedText style={[styles.authorBadgeText, { color: getAuthorTypeColor(article.authorType) }]}>
                            {getAuthorTypeLabel(article.authorType)}
                          </ThemedText>
                        </View>
                        <ThemedText style={[styles.articleCategory, { color: colors.textSecondary }]}>
                          {article.category}
                        </ThemedText>
                      </View>
                      
                      <Pressable onPress={() => handleArticleAction(article.id, '收藏')}>
                        <ThemedText style={[styles.bookmarkIcon, { color: article.isBookmarked ? colors.warning : colors.textSecondary }]}>
                          {article.isBookmarked ? '⭐' : '☆'}
                        </ThemedText>
                      </Pressable>
                    </View>

                    <ThemedText style={[styles.articleTitle, { color: colors.text }]}>
                      {article.title}
                    </ThemedText>
                    
                    <ThemedText style={[styles.articleSummary, { color: colors.textSecondary }]}>
                      {article.summary}
                    </ThemedText>

                    <View style={styles.articleFooter}>
                      <View style={styles.articleInfo}>
                        <ThemedText style={[styles.articleAuthor, { color: colors.textSecondary }]}>
                          {article.author}
                        </ThemedText>
                        <ThemedText style={[styles.articleTime, { color: colors.textSecondary }]}>
                          {article.readTime} · {article.publishedAt}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.articleActions}>
                        <Pressable
                          style={styles.likeButton}
                          onPress={() => handleArticleAction(article.id, '点赞')}
                        >
                          <ThemedText style={[styles.likeIcon, { color: colors.textSecondary }]}>
                            ❤️
                          </ThemedText>
                          <ThemedText style={[styles.likeCount, { color: colors.textSecondary }]}>
                            {article.likes}
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.loadMoreButton}>
              <ThemedText style={[styles.loadMoreText, { color: colors.primary }]}>
                加载更多文章
              </ThemedText>
            </Pressable>
          </Card>

          {/* 专家问答 */}
          <Card variant="default" style={styles.qaCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
                🩺 专家问答
              </ThemedText>
            </View>
            
            <View style={styles.qaContent}>
              <ThemedText style={[styles.qaDescription, { color: colors.textSecondary }]}>
                有孕期问题？向专业医生和有经验的妈妈们提问
              </ThemedText>
              
              <Pressable
                style={[styles.askButton, { backgroundColor: colors.primary }]}
                onPress={() => Alert.alert('提问', '专家问答功能正在开发中...')}
              >
                <ThemedText style={[styles.askButtonText, { color: colors.neutral100 }]}>
                  我要提问
                </ThemedText>
              </Pressable>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.md,
  },
  searchContainer: {
    marginBottom: 0,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  categoriesCard: {
    marginBottom: Spacing.md,
  },
  articlesCard: {
    marginBottom: Spacing.md,
  },
  qaCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryItem: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: FontSizes.bodySmall,
  },
  articlesList: {
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  articleItem: {
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  articleContent: {
    gap: Spacing.sm,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  authorBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  authorBadgeText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  articleCategory: {
    fontSize: FontSizes.bodySmall,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  articleTitle: {
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
    lineHeight: 24,
  },
  articleSummary: {
    fontSize: FontSizes.body,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  articleAuthor: {
    fontSize: FontSizes.bodySmall,
    fontWeight: FontWeights.medium,
  },
  articleTime: {
    fontSize: FontSizes.bodySmall,
  },
  articleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  likeIcon: {
    fontSize: 16,
  },
  likeCount: {
    fontSize: FontSizes.bodySmall,
  },
  loadMoreButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
  },
  loadMoreText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  qaContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  qaDescription: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    lineHeight: 20,
  },
  askButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  askButtonText: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
  },
});