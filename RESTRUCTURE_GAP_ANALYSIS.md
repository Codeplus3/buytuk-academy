# تقرير تحليل الفجوة - إعادة هيكلة مشروع BuyTuk Academy

**التاريخ:** 2026-08-27  
**الإصدار الحالي:** v2.7.1  
**الهدف:** إعادة هيكلة المشروع ليتوافق مع الهيكل القياسي Monorepo

---

## 📊 ملخص التنفيذ

| الفئة | المكتمل | غير مكتمل | غير موجود | النسبة المئوية |
|-------|---------|-----------|-----------|---------------|
| ملفات التكوين الجذرية | 8 | 8 | 0 | 50% |
| التطبيقات (apps/) | 0 | 0 | 3 | 0% |
| المحركات (engines/) | 0 | 5 | 6 | 0% |
| المجالات (domains/) | 0 | 0 | 4 | 0% |
| الحزم (packages/) | 1 | 3 | 7 | 10% |
| البنية التحتية | 0 | 0 | 5 | 0% |
| **الإجمالي** | **9** | **16** | **25** | **18%** |

---

## ✅ الملفات الموجودة (يمكن نقلها)

### 1. ملفات التكوين الجذرية
- ✅ .gitignore
- ✅ .env.example
- ✅ package.json
- ✅ pnpm-workspace.yaml
- ✅ turbo.json
- ✅ README.md
- ✅ tsconfig.json
- ✅ tsconfig.base.json

### 2. المحركات الحالية (في الجذر - يجب نقلها)
- ✅ benchmark-engine.ts → engines/benchmark-engine/
- ✅ local-stt-engine.ts → engines/stt-engine/
- ✅ local-vision-engine.ts → engines/vision-engine/
- ✅ sync-engine.ts → engines/sync-engine/
- ✅ use-offline-media-engine.ts → engines/offline-media-engine/

### 3. المكونات الحالية (في الجذر - يجب نقلها)
- ✅ button.tsx, card.tsx, dialog.tsx, input.tsx, textarea.tsx → packages/ui/
- ✅ utils.ts, types.ts, auth.ts → packages/shared/
- ✅ i18n.ts → packages/i18n/
- ✅ security.ts → packages/security/

### 4. البنية الحالية (يجب إعادة هيكلتها)
- ✅ artifacts/api-server/ → apps/api/
- ✅ artifacts/admin-dashboard/ → apps/web/
- ✅ lib/db/ → packages/database/
- ✅ lib/api-spec/ → packages/contracts/
- ✅ lib/api-zod/ → packages/contracts/
- ✅ lib/api-client-react/ → packages/ui/
- ✅ docs/ → docs/

---

## ❌ الملفات غير الموجودة (يجب إنشاؤها)

### 1. ملفات التكوين المفقودة
- ❌ .nvmrc
- ❌ .editorconfig
- ❌ .prettierrc
- ❌ .prettierignore
- ❌ eslint.config.js
- ❌ docker-compose.yml
- ❌ docker-compose.prod.yml
- ❌ CONTRIBUTING.md
- ❌ ARCHITECTURE.md

### 2. التطبيقات المفقودة (apps/)
- ❌ apps/api/ - NestJS Backend (موحّد)
  - modules/auth/, users/, students/, teachers/, parents/, classes/, subjects/, lessons/, sessions/, attempts/, reports/, exercises/, mastery/, analytics/, audio/, content/, curriculum/, wallet/, points/, messages/, notes/, support/, attendance/, ratings/, exams/, notifications/, webhooks/, audit/, rbac/, admin/, websocket/, health/
- ❌ apps/web/ - Next.js Frontend (موحّد)
  - (auth)/, (student)/, (teacher)/, (parent)/, (principal)/, (admin)/, (english)/
- ❌ apps/worker/ - BullMQ Workers (موحّد)
  - processors/reading-analysis, lesson-processing, content-generation, notification, webhook, analytics-aggregation, report-generation, retry, cleanup, scheduled-tasks

### 3. المحركات المفقودة (engines/)
- ❌ engines/reading-engine/ - محرك القراءة (من v4.0)
  - pipeline/audio-enhancement, feature-extraction, vad, stt-client, forced-alignment-client, g2p-client, ipa-mapper, phonetic-matrix, alignment, inference-client
  - engines/confidence, reading-score, mastery, gap, rule, ai-feedback, recommendation, report-generator
- ❌ engines/assessment-engine/ - محرك التقييم العام
  - scoring/score-calculator, grade-calculator, percentile-calculator
  - evaluation/formative-assessment, summative-assessment, diagnostic-assessment
  - rubrics/rubric-manager, rubric-templates
- ❌ engines/content-engine/ - محرك المحتوى
  - generation/content-generator, question-generator, exercise-generator
  - management/content-manager, version-control, approval-workflow
  - delivery/content-delivery, adaptive-content, personalized-content
- ❌ engines/lesson-engine/ - محرك الدروس
  - planning/lesson-planner, objective-mapper, activity-sequencer
  - delivery/lesson-delivery, timeline-manager, pacing-controller
  - interaction/student-interaction, teacher-interaction, collaborative-learning
- ❌ engines/dictation-engine/ - محرك الإملاء
  - dictation/dictation-session, word-presentation, response-evaluation
  - correction/error-detection, correction-suggestions, feedback-generator
- ❌ engines/learning-diagnosis/ - محرك التشخيص التعليمي
  - diagnosis/learning-gap-detector, misconception-detector, skill-mastery-analyzer
  - intervention/intervention-planner, remediation-strategy, support-recommendation
  - cognitive/cognitive-profile, learning-style-analyzer, multiple-intelligence

### 4. المجالات المفقودة (domains/)
- ❌ domains/english/ - تعلم الإنجليزية
  - reading/, writing/, listening/, speaking/, grammar/, vocabulary/, pronunciation/
- ❌ domains/arabic/ - تعلم العربية
  - reading/, writing/, grammar/, vocabulary/, tajweed/
- ❌ domains/math/ - الرياضيات
  - arithmetic/, algebra/, geometry/, calculus/
- ❌ domains/science/ - العلوم
  - physics/, chemistry/, biology/

### 5. الحزم المفقودة (packages/)
- ❌ packages/ui/ - مكونات UI (موجودة جزئياً في الجذر)
  - button, input, textarea, card, badge, sidebar, table, modal, progress-bar, avatar, tabs, dropdown, toast, voice-input, audio-player, waveform, error-state, loading-state, empty-state
- ❌ packages/contracts/ - Types & DTOs مشتركة
  - enums, auth, user, student, teacher, parent, principal, class, subject, lesson, session, attempt, report, exercise, mastery, scoring, phoneme, alignment, gap, recommendation, analytics, audio, content, curriculum, wallet, points, messages, notes, attendance, exams, rbac, audit, websocket
- ❌ packages/config/ - Configuration
  - app.config, database.config, redis.config, security.config, audio.config, scoring.config, pipeline.config, models.config
- ❌ packages/shared/ - Utilities (موجودة جزئياً في الجذر)
  - error-codes, constants, normalize, time, ids, arabic-utils, english-utils, math-utils, guards
- ❌ packages/queue/ - BullMQ setup
  - queues, messages, bullmq.config, dlq.service
- ❌ packages/security/ - Security layer (موجودة جزئياً في الجذر)
  - encryption, signed-urls, api-keys, rls, token
- ❌ packages/observability/ - Logs + Metrics + Traces
  - logger, metrics, tracing, health
- ❌ packages/exercises-catalog/ - Exercise data
  - arabic/reading, arabic/writing, arabic/grammar, english/reading, english/writing, english/grammar, math
- ❌ packages/curriculum/ - Curriculum data
  - standards, objectives, scope-sequence, mapping
- ❌ packages/i18n/ - Internationalization (موجودة جزئياً في الجذر)
  - ar.json, en.json, config

### 6. البنية التحتية المفقودة inference-gateway/ - Python ML workers
  - gateway/server, circuit-breaker, auth
  - workers/whisper_worker, alignment_worker, g2p_worker, feedback_worker
  - models/whisper_service, whisperx_service, mms_service, camel_service, llm_service
- ❌ docker/ - Dockerfiles
  - api.Dockerfile, web.Dockerfile, worker.Dockerfile, inference.Dockerfile, nginx.conf, certs/
- ❌ k8s/ - Kubernetes manifests
  - namespace, configmap, secret, api-deployment, web-deployment, worker-deployment, inference-deployment, postgres-statefulset, redis-deployment, ingress, hpa, network-policy
- ❌ scripts/ - Dev scripts
  - setup-dev.sh, seed-database.ts, verify-migration.sh, gate-report.sh, generate-proto.sh, load-test.sh
- ❌ tests/ - All tests
  - e2e/, integration/, contract/, acceptance/, security/, unit/, load/
- ❌ provider_configs/ - Model configs
  - whisper-large-v3.yaml, whisperx-alignment.yaml, mms-fa-arabic.yaml, camel-tools.yaml, silero-vad.yaml, deepfilternet.yaml

---

## 🔄 خطة إعادة الهيكلة

### المرحلة 1: إنشاء هيكل المجلدات الأساسي
- إنشاء apps/, engines/, domains/, packages/, inference-gateway/, docker/, k8s/, scripts/, tests/, provider_configs/

### المرحلة 2: نقل الملفات الموجودة
- نقل المحركات من الجذر إلى engines/
- نقل المكونات من الجذر إلى packages/ui/
- نقل المساعدات من الجذر إلى packages/shared/
- نقل artifacts/ إلى apps/
- نقل lib/ إلى packages/

### المرحلة 3: إنشاء ملفات التكوين المفقودة
- إنشاء .nvmrc, .editorconfig, .prettierrc, .prettierignore
- إنشاء eslint.config.js
- إنشاء docker-compose.yml, docker-compose.prod.yml
- إنشاء CONTRIBUTING.md, ARCHITECTURE.md

### المرحلة 4: إنشاء التطبيقات الأساسية
- إنشاء apps/api/ مع NestJS structure
- إنشاء apps/web/ مع Next.js structure
- إنشاء apps/worker/ مع BullMQ structure

### المرحلة 5: إنشاء المحركات المفقودة
- إنشاء engines/reading-engine/
- إنشاء engines/assessment-engine/
- إنشاء engines/content-engine/
- إنشاء engines/lesson-engine/
- إنشاء engines/dictation-engine/
- إنشاء engines/learning-diagnosis/

### المرحلة 6: إنشاء المجالات
- إنشاء domains/english/
- إنشاء domains/arabic/
- إنشاء domains/math/
- إنشاء domains/science/

### المرحلة 7: إنشاء الحزم المشتركة
- إنشاء packages/contracts/
- إنشاء packages/config/
- إنشاء packages/queue/
- إنشاء packages/observability/
- إنشاء packages/exercises-catalog/
- إنشاء packages/curriculum/

### المرحلة 8: إضافة البنية التحتية
- إنشاء inference-gateway/
- إنشاء docker/
- إنشاء k8s/
- إنشاء scripts/
- إنشاء tests/
- إنشاء provider_configs/

### المرحلة 9: تحديث التكوين
- تحديث pnpm-workspace.yaml
- تحديث turbo.json
- تحديث package.json

### المرحلة 10: اختبار والتحقق
- اختبار البناء
- اختبار التكامل
- التحقق من الهيكل

---

## 📈 الأولويات

### عالية الأولوية (المرحلة 1-4)
- إنشاء هيكل المجلدات الأساسي
- نقل الملفات الموجودة
- إنشاء ملفات التكوين المفقودة
- إنشاء التطبيقات الأساسية

### متوسطة الأولوية (المرحلة 5-7)
- إنشاء المحركات المفقودة
- إنشاء المجالات
- إنشاء الحزم المشتركة

### منخفضة الأولوية (المرحلة 8-10)
- إضافة البنية التحتية
- تحديث التكوين
- اختبار والتحقق

---

## 🎯 النتيجة المتوقعة

بعد إكمال إعادة الهيكلة، سيكون المشروع:
- ✅ منظم بشكل صحيح حسب معايير Monorepo
- ✅ يحتوي على جميع التطبيقات المطلوبة
- ✅ يحتوي على جميع المحركات المطلوبة
- ✅ يحتوي على جميع الحزم المشتركة
- ✅ جاهز للتطوير والإنتاج
- ✅ متوافق مع الهيكل القياسي

---

**نهاية التقرير**
