import MainLayout from '../../../shared/components/layouts/MainLayout';
// import AddWordForm from '../vocabulary/AddWordForm';
import VocabularyList from '../components/VocabularyList';

const VocabularyPage = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Vocabulary</h1>
        {/* <AddWordForm /> */}
        <VocabularyList />
      </div>
    </MainLayout>
  );
};

export default VocabularyPage;